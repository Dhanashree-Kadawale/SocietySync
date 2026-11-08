import { Injectable, signal, computed, inject } from '@angular/core';
import { ApiService } from './api.service';
import { AuthService } from './auth.service';
import { MaintenanceTask, MaterialRequest, RepairPhoto, StaffNotification, TaskStatus } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class MaintenanceService {
  private api = inject(ApiService);
  private authService = inject(AuthService, { optional: true });

  // Staff Profile
  readonly staffProfile = signal({
    name: 'Lead Maintenance Engineer',
    role: 'Lead Maintenance Engineer',
    staffId: 'STF-ENG-303',
    phone: '+91 98765 77112',
    department: 'Civil, Plumbing & Electrical Maintenance',
    societyName: 'SocietySync Community',
    shift: 'General Shift (08:00 AM - 05:00 PM)',
    activeRating: 4.9,
    tasksResolvedThisMonth: 18
  });

  constructor() {
    this.authService?.authStateChanged$.subscribe(user => {
      if (user) {
        this.staffProfile.update(p => ({
          ...p,
          name: user.name || p.name,
          role: user.role || p.role,
          phone: user.phone || p.phone,
          societyName: user.societyName || p.societyName,
          staffId: user.id || p.staffId
        }));
        this.syncFromBackend();
      }
    });
  }

  public syncFromBackend() {
    this.api.getComplaints().subscribe({
      next: (res) => {
        if (res?.success && res.data) {
          const mapped: MaintenanceTask[] = res.data.map((c: any) => ({
            id: 'TSK-' + c.id,
            complaintId: 'CMP-' + c.id,
            title: c.title,
            category: c.category || 'Maintenance',
            flat: c.flatNumber || 'A-101',
            wing: c.flatNumber?.startsWith('B') ? 'Tower B' : (c.flatNumber?.startsWith('C') ? 'Tower C' : 'Tower A'),
            residentName: c.residentName || 'Resident',
            residentPhone: '+91 98000 12345',
            priority: (c.priority === 'HIGH' ? 'High' : (c.priority === 'LOW' ? 'Low' : 'Medium')) as any,
            status: (c.status === 'RESOLVED' ? 'Resolved' : (c.status === 'IN_PROGRESS' ? 'In Progress' : 'Pending')) as any,
            assignedDate: c.createdAt ? new Date(c.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : 'Today',
            dueDate: 'Tomorrow',
            description: c.description || '',
            workNotes: c.resolutionNotes || '',
            materialsUsed: [],
            photos: []
          }));
          this.tasks.set(mapped);
        }
      },
      error: () => {}
    });
  }

  // Tasks List
  readonly tasks = signal<MaintenanceTask[]>([]);

  // Material Requests
  readonly materialRequests = signal<MaterialRequest[]>([]);

  // Staff Notifications
  readonly notifications = signal<StaffNotification[]>([]);

  // Computed metrics
  readonly assignedCount = computed(() => this.tasks().filter(t => t.status === 'Assigned').length);
  readonly inProgressCount = computed(() =>
    this.tasks().filter(t => t.status === 'In Progress' || t.status === 'Accepted').length
  );
  readonly resolvedCount = computed(() => this.tasks().filter(t => t.status === 'Resolved').length);
  readonly delayedCount = computed(() => this.tasks().filter(t => t.status === 'Delayed').length);
  readonly urgentCount = computed(() =>
    this.tasks().filter(t => t.priority === 'Urgent' && t.status !== 'Resolved').length
  );
  readonly unreadNotificationsCount = computed(() =>
    this.notifications().filter(n => !n.isRead).length
  );

  // Actions

  // 1. Accept Task
  acceptTask(taskId: string): void {
    const numericId = parseInt(taskId.replace(/\D/g, ''), 10) || 1;
    this.api.updateComplaint(numericId, {
      status: 'IN_PROGRESS'
    }).subscribe({ error: () => {} });

    this.tasks.update(list =>
      list.map(t => (t.id === taskId ? { ...t, status: 'Accepted' } : t))
    );
    this.addNotification({
      title: `Task Accepted: ${taskId}`,
      message: `You have accepted task ${taskId}. You can now start work and upload work notes.`,
      type: 'Assignment',
      taskId: taskId
    });
  }

  // 2. Report Assignment Issue
  reportAssignmentIssue(taskId: string, reason: string): void {
    this.tasks.update(list =>
      list.map(t =>
        t.id === taskId
          ? {
              ...t,
              status: 'Issue Reported',
              assignmentIssueReason: reason
            }
          : t
      )
    );
    this.addNotification({
      title: `Issue Reported on ${taskId}`,
      message: `Assignment issue flagged: "${reason}". Admin notified for reassignment.`,
      type: 'Admin Note',
      taskId: taskId
    });
  }

  // 3. Update Work Status
  updateTaskStatus(taskId: string, newStatus: TaskStatus, notes?: string): void {
    const numericId = parseInt(taskId.replace(/\D/g, ''), 10) || 1;
    this.api.updateComplaint(numericId, {
      status: (newStatus === 'Resolved' ? 'RESOLVED' : newStatus === 'In Progress' ? 'IN_PROGRESS' : 'OPEN')
    }).subscribe({ error: () => {} });

    this.tasks.update(list =>
      list.map(t => {
        if (t.id !== taskId) return t;
        const updated = { ...t, status: newStatus };
        if (notes) {
          updated.workNotes = t.workNotes ? `${t.workNotes}\n[${newStatus}]: ${notes}` : notes;
        }
        if (newStatus === 'Resolved') {
          updated.completedDate = 'Today';
        }
        return updated;
      })
    );
  }

  // 4. Save Work Notes and Materials
  saveWorkNotes(taskId: string, notes: string, materials: string[]): void {
    this.tasks.update(list =>
      list.map(t =>
        t.id === taskId
          ? {
              ...t,
              workNotes: notes,
              materialsUsed: materials.length > 0 ? materials : t.materialsUsed
            }
          : t
      )
    );
  }

  // 5. Upload Repair Photo
  uploadRepairPhoto(taskId: string, type: 'before' | 'after', caption: string, photoUrl?: string): void {
    const newPhoto: RepairPhoto = {
      id: `PH-${Date.now()}`,
      url: photoUrl || 'society_hero.jpg',
      type: type,
      caption: caption || `${type.toUpperCase()} repair inspection snapshot`,
      timestamp: 'Today, Just now'
    };

    this.tasks.update(list =>
      list.map(t => {
        if (t.id !== taskId) return t;
        const currentPhotos = t.photos || [];
        return {
          ...t,
          photos: [...currentPhotos, newPhoto]
        };
      })
    );
  }

  // 6. Report Delay
  reportDelay(taskId: string, reason: string, revisedDueDate: string): void {
    this.tasks.update(list =>
      list.map(t =>
        t.id === taskId
          ? {
              ...t,
              status: 'Delayed',
              delayReason: reason,
              revisedDueDate: revisedDueDate
            }
          : t
      )
    );
    this.addNotification({
      title: `Delay Logged for ${taskId}`,
      message: `Task ${taskId} delayed: ${reason}. Revised due date set to ${revisedDueDate}.`,
      type: 'Reminder',
      taskId: taskId
    });
  }

  // 7. Request Material / Spare Parts
  requestMaterial(data: {
    taskId?: string;
    taskTitle?: string;
    itemName: string;
    category: MaterialRequest['category'];
    quantity: string;
    urgency: MaterialRequest['urgency'];
    reason: string;
  }): void {
    const newReq: MaterialRequest = {
      id: `REQ-2026-${Math.floor(100 + Math.random() * 900)}`,
      taskId: data.taskId,
      taskTitle: data.taskTitle,
      itemName: data.itemName,
      category: data.category,
      quantity: data.quantity,
      urgency: data.urgency,
      reason: data.reason,
      status: 'Pending',
      requestDate: 'Today'
    };

    this.materialRequests.update(list => [newReq, ...list]);
    this.addNotification({
      title: `Material Request Logged (${newReq.id})`,
      message: `Requisition for "${data.itemName}" submitted to Estate Admin.`,
      type: 'Material'
    });
  }

  // 8. Notifications
  addNotification(item: Omit<StaffNotification, 'id' | 'timestamp' | 'isRead'>): void {
    const newNotif: StaffNotification = {
      ...item,
      id: `SNOTIF-${Date.now()}`,
      timestamp: 'Just now',
      isRead: false
    };
    this.notifications.update(list => [newNotif, ...list]);
  }

  markNotificationRead(id: string): void {
    this.notifications.update(list =>
      list.map(n => (n.id === id ? { ...n, isRead: true } : n))
    );
  }

  markAllNotificationsRead(): void {
    this.notifications.update(list => list.map(n => ({ ...n, isRead: true })));
  }
}
