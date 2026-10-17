import { Injectable, signal, computed } from '@angular/core';
import { MaintenanceTask, MaterialRequest, RepairPhoto, StaffNotification, TaskStatus } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class MaintenanceService {
  // Staff Profile
  readonly staffProfile = signal({
    name: 'Ramesh Shinde',
    role: 'Lead Maintenance Engineer',
    staffId: 'STF-ENG-303',
    phone: '+91 98765 77112',
    department: 'Civil, Plumbing & Electrical Maintenance',
    societyName: 'Greenwood Heights Co-Operative Housing Society',
    shift: 'General Shift (08:00 AM - 05:00 PM)',
    activeRating: 4.9,
    tasksResolvedThisMonth: 18
  });

  // Tasks List
  readonly tasks = signal<MaintenanceTask[]>([
    {
      id: 'TSK-104',
      complaintId: 'CMP-2026-104',
      title: 'Water pressure low in master bedroom bathroom',
      category: 'Plumbing',
      flat: 'A-204',
      wing: 'Tower A',
      residentName: 'Priya Sharma',
      residentPhone: '+91 98765 12340',
      priority: 'Medium',
      status: 'In Progress',
      assignedDate: '16 Oct 2026',
      dueDate: '18 Oct 2026',
      description: 'The overhead shower in master bedroom is receiving very low water pressure since yesterday morning.',
      workNotes: 'Inspected terrace line pressure gauge; cleaned aerator screen and checked PPR riser valve on 2nd floor shaft.',
      materialsUsed: ['Teflon Thread Tape', 'Pressure Gauge Washer'],
      photos: [
        {
          id: 'PH-1',
          url: 'society_hero.jpg',
          type: 'before',
          caption: 'Shaft riser valve inspection',
          timestamp: '16 Oct 2026, 02:15 PM'
        }
      ]
    },
    {
      id: 'TSK-105',
      complaintId: 'CMP-2026-105',
      title: 'Corridor LED light fixture blinking on 3rd floor',
      category: 'Electrical',
      flat: 'Common Area B-3',
      wing: 'Tower B',
      residentName: 'Society Admin (Dhanashree)',
      residentPhone: '+91 98765 43210',
      priority: 'Low',
      status: 'Assigned',
      assignedDate: '17 Oct 2026',
      dueDate: '19 Oct 2026',
      description: 'The ceiling surface panel LED near Lift B2 is flickering continuously causing disturbance to residents.'
    },
    {
      id: 'TSK-106',
      complaintId: 'CMP-2026-092',
      title: 'Balcony sliding door latch jammed',
      category: 'Carpentry',
      flat: 'A-204',
      wing: 'Tower A',
      residentName: 'Priya Sharma',
      residentPhone: '+91 98765 12340',
      priority: 'Low',
      status: 'Accepted',
      assignedDate: '14 Oct 2026',
      dueDate: '19 Oct 2026',
      description: 'The lock latch on the living room balcony door is sticking and cannot be locked securely.'
    },
    {
      id: 'TSK-107',
      complaintId: 'CMP-2026-107',
      title: 'Water seepage in basement B2 near electrical room',
      category: 'Plumbing',
      flat: 'Basement B2',
      wing: 'Central Block',
      residentName: 'Estate Security Guard Gate 2',
      residentPhone: '+91 98220 99111',
      priority: 'Urgent',
      status: 'Delayed',
      assignedDate: '15 Oct 2026',
      dueDate: '17 Oct 2026',
      description: 'Persistent drainage leak trickling near main HT transformer panel in Basement level B2.',
      delayReason: 'Requires main municipal intake valve shutdown between 11 PM and 2 AM to avoid society water outage during daytime.',
      revisedDueDate: '19 Oct 2026',
      workNotes: 'Temporary sandbag barrier installed to safeguard transformer room trench.'
    },
    {
      id: 'TSK-098',
      complaintId: 'CMP-2026-081',
      title: 'Tower A Lift 2 jerk during stop on 2nd floor',
      category: 'Lift',
      flat: 'Tower A Lift 2',
      wing: 'Tower A',
      residentName: 'Tower A Residents',
      residentPhone: '+91 98765 88990',
      priority: 'Urgent',
      status: 'Resolved',
      assignedDate: '08 Oct 2026',
      dueDate: '10 Oct 2026',
      description: 'Lift 2 produces a loud mechanical thud and jerks slightly when leveling at the 2nd floor.',
      workNotes: 'Schindler OEM technician accompanied. Hydraulic leveling buffer sensor recalibrated and guide rail lubricated.',
      materialsUsed: ['OEM Leveling Sensor Buffer Kit', 'Silicone Guide Rail Grease'],
      completedDate: '10 Oct 2026',
      timeSpentHours: 3.5,
      residentRating: 5
    },
    {
      id: 'TSK-092',
      complaintId: 'CMP-2026-077',
      title: 'Clubhouse main switchboard MCB tripping',
      category: 'Electrical',
      flat: 'Clubhouse Ground Floor',
      wing: 'Amenity Center',
      residentName: 'Secretary Rajesh Mehta',
      residentPhone: '+91 98765 88990',
      priority: 'High',
      status: 'Resolved',
      assignedDate: '04 Oct 2026',
      dueDate: '05 Oct 2026',
      description: 'Air conditioning power breaker tripping repeatedly during evening clubhouse hours.',
      workNotes: 'Detected loose neutral wire on Phase 2 busbar. Cleaned terminal corrosion and installed 40A Siemens breaker.',
      materialsUsed: ['40A 3-Phase MCB', 'Crimping Lug Terminals', 'Insulation Tape'],
      completedDate: '05 Oct 2026',
      timeSpentHours: 2,
      residentRating: 5
    }
  ]);

  // Material Requests
  readonly materialRequests = signal<MaterialRequest[]>([
    {
      id: 'REQ-2026-041',
      taskId: 'TSK-104',
      taskTitle: 'Water pressure low in master bedroom bathroom',
      itemName: '1/2 Inch CPVC Ball Valves & Teflon Roll Pack',
      category: 'Plumbing',
      quantity: '4 Pieces & 3 Rolls',
      urgency: 'High',
      reason: 'Required to replace rusted balancing valves in Tower A utility plumbing duct.',
      status: 'Approved',
      requestDate: '16 Oct 2026',
      adminRemarks: 'Approved by Secretary Rajesh Mehta. Collect from Store Room B1.'
    },
    {
      id: 'REQ-2026-039',
      taskId: 'TSK-105',
      taskTitle: 'Corridor LED light fixture blinking',
      itemName: '18W Square LED Surface Downlights (Cool Day White)',
      category: 'Electrical',
      quantity: '5 Units',
      urgency: 'Normal',
      reason: 'Replacing end-of-life driver fixtures across Tower B 3rd and 4th floor corridors.',
      status: 'Pending',
      requestDate: '17 Oct 2026'
    },
    {
      id: 'REQ-2026-028',
      itemName: 'Digital Multi-clamp AC/DC True-RMS Meter',
      category: 'Tools',
      quantity: '1 Unit',
      urgency: 'Normal',
      reason: 'Tool replacement for ongoing generator room phase-load balancing audit.',
      status: 'Issued',
      requestDate: '08 Oct 2026',
      adminRemarks: 'Issued from Society Maintenance Asset Locker #3.'
    }
  ]);

  // Staff Notifications
  readonly notifications = signal<StaffNotification[]>([
    {
      id: 'SNOTIF-1',
      title: 'New Complaint Assigned: TSK-105',
      message: 'Tower B corridor LED fixture blinking has been assigned to you by Society Admin.',
      type: 'Assignment',
      timestamp: 'Today, 09:30 AM',
      isRead: false,
      taskId: 'TSK-105'
    },
    {
      id: 'SNOTIF-2',
      title: 'Material Request Approved',
      message: 'REQ-2026-041 for CPVC Ball Valves approved. You can collect items from Store Room B1.',
      type: 'Material',
      timestamp: 'Yesterday, 04:00 PM',
      isRead: false
    },
    {
      id: 'SNOTIF-3',
      title: 'Urgent Task Reminder: TSK-107',
      message: 'Basement B2 transformer water seepage night shutdown scheduled for tonight.',
      type: 'Reminder',
      timestamp: '16 Oct 2026',
      isRead: true,
      taskId: 'TSK-107'
    }
  ]);

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
