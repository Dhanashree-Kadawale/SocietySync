import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MaintenanceService } from '../../services/maintenance.service';
import { AuthService } from '../../services/auth.service';
import { MaintenanceTask, MaterialRequest, TaskStatus } from '../../models/user.model';

export type StaffTab = 'dashboard' | 'assigned' | 'history' | 'materials' | 'delays';

@Component({
  selector: 'app-staff-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './staff-dashboard.component.html',
  styleUrl: './staff-dashboard.component.css'
})
export class StaffDashboardComponent {
  // Navigation
  activeTab = signal<StaffTab>('dashboard');
  searchQuery = signal<string>('');
  categoryFilter = signal<string>('All');
  priorityFilter = signal<string>('All');

  // Modals
  showTaskDetailModal = signal<boolean>(false);
  showPhotoUploadModal = signal<boolean>(false);
  showIssueModal = signal<boolean>(false);
  showDelayModal = signal<boolean>(false);
  showMaterialModal = signal<boolean>(false);
  showNotificationsDrawer = signal<boolean>(false);

  // Selected Task for actions
  selectedTask = signal<MaintenanceTask | null>(null);

  // Toast
  toastMessage = signal<string | null>(null);

  // Form states:
  // 1. Work Notes & Status
  taskStatusUpdate: TaskStatus = 'In Progress';
  workNotesText = '';
  materialsInput = '';

  // 2. Photo Upload Form
  photoType: 'before' | 'after' = 'before';
  photoCaption = '';
  photoPreviewUrl = 'society_hero.jpg';

  // 3. Issue Reporting Form
  issueReason = '';

  // 4. Delay Form
  delayReason = '';
  revisedDueDate = '2026-10-21';

  // 5. Material Requisition Form
  newMaterial = {
    itemName: '',
    category: 'Plumbing' as MaterialRequest['category'],
    quantity: '1 Unit',
    urgency: 'Normal' as MaterialRequest['urgency'],
    reason: ''
  };

  // Filtered tasks computation
  filteredAssignedTasks = computed(() => {
    const list = this.maintenanceService.tasks().filter(t => t.status !== 'Resolved');
    const cat = this.categoryFilter();
    const prio = this.priorityFilter();
    const query = this.searchQuery().toLowerCase().trim();

    return list.filter(t => {
      const matchCat = cat === 'All' || t.category === cat;
      const matchPrio = prio === 'All' || t.priority === prio;
      const matchQuery =
        !query ||
        t.title.toLowerCase().includes(query) ||
        t.flat.toLowerCase().includes(query) ||
        t.id.toLowerCase().includes(query);
      return matchCat && matchPrio && matchQuery;
    });
  });

  completedHistoryTasks = computed(() => {
    return this.maintenanceService.tasks().filter(t => t.status === 'Resolved');
  });

  delayedTasks = computed(() => {
    return this.maintenanceService.tasks().filter(t => t.status === 'Delayed');
  });

  constructor(
    public maintenanceService: MaintenanceService,
    public authService: AuthService,
    private router: Router
  ) {}

  get userInitials(): string {
    const name = this.authService.currentUser()?.name || this.maintenanceService.staffProfile().name;
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  }

  get userName(): string {
    return this.authService.currentUser()?.name || this.maintenanceService.staffProfile().name;
  }

  get userRole(): string {
    return this.authService.currentUser()?.role || this.maintenanceService.staffProfile().role;
  }

  get societyName(): string {
    return this.authService.currentUser()?.societyName || this.maintenanceService.staffProfile().societyName;
  }

  setTab(tab: string): void {
    const validTabs: StaffTab[] = ['dashboard', 'assigned', 'history', 'materials', 'delays'];
    if (validTabs.includes(tab as StaffTab)) {
      this.activeTab.set(tab as StaffTab);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  showToast(msg: string): void {
    this.toastMessage.set(msg);
    setTimeout(() => {
      this.toastMessage.set(null);
    }, 3500);
  }

  // --- TASK ACTIONS ---
  openTaskDetails(task: MaintenanceTask): void {
    this.selectedTask.set(task);
    this.taskStatusUpdate = task.status;
    this.workNotesText = task.workNotes || '';
    this.materialsInput = (task.materialsUsed || []).join(', ');
    this.showTaskDetailModal.set(true);
  }

  closeTaskDetails(): void {
    this.showTaskDetailModal.set(false);
    this.selectedTask.set(null);
  }

  saveTaskWork(): void {
    const task = this.selectedTask();
    if (!task) return;

    const materialsArray = this.materialsInput
      .split(',')
      .map(s => s.trim())
      .filter(s => s.length > 0);

    this.maintenanceService.updateTaskStatus(task.id, this.taskStatusUpdate, this.workNotesText);
    this.maintenanceService.saveWorkNotes(task.id, this.workNotesText, materialsArray);

    this.closeTaskDetails();
    this.showToast(`Task ${task.id} updated to "${this.taskStatusUpdate}" successfully!`);
  }

  // Quick Accept
  acceptTaskDirectly(task: MaintenanceTask, event?: Event): void {
    if (event) event.stopPropagation();
    this.maintenanceService.acceptTask(task.id);
    this.showToast(`Task ${task.id} accepted! You are assigned to complete this repair.`);
  }

  // Quick Start Work
  startWorkDirectly(task: MaintenanceTask, event?: Event): void {
    if (event) event.stopPropagation();
    this.maintenanceService.updateTaskStatus(task.id, 'In Progress');
    this.showToast(`Task ${task.id} status changed to In Progress!`);
  }

  // Issue Reporting
  openIssueModal(task: MaintenanceTask, event?: Event): void {
    if (event) event.stopPropagation();
    this.selectedTask.set(task);
    this.issueReason = '';
    this.showIssueModal.set(true);
  }

  closeIssueModal(): void {
    this.showIssueModal.set(false);
    this.selectedTask.set(null);
  }

  submitAssignmentIssue(): void {
    const task = this.selectedTask();
    if (!task || !this.issueReason.trim()) {
      alert('Please state the assignment issue reason.');
      return;
    }
    this.maintenanceService.reportAssignmentIssue(task.id, this.issueReason);
    this.closeIssueModal();
    this.showToast(`Issue reported on task ${task.id}. Society Admin notified.`);
  }

  // Photo Upload
  openPhotoModal(task: MaintenanceTask, event?: Event): void {
    if (event) event.stopPropagation();
    this.selectedTask.set(task);
    this.photoType = 'before';
    this.photoCaption = '';
    this.showPhotoUploadModal.set(true);
  }

  closePhotoModal(): void {
    this.showPhotoUploadModal.set(false);
    this.selectedTask.set(null);
  }

  submitRepairPhoto(): void {
    const task = this.selectedTask();
    if (!task) return;

    this.maintenanceService.uploadRepairPhoto(
      task.id,
      this.photoType,
      this.photoCaption,
      this.photoPreviewUrl
    );
    this.closePhotoModal();
    this.showToast(`${this.photoType.toUpperCase()} repair photo attached to task ${task.id}!`);
  }

  // Delay Reporting
  openDelayModal(task: MaintenanceTask, event?: Event): void {
    if (event) event.stopPropagation();
    this.selectedTask.set(task);
    this.delayReason = task.delayReason || '';
    this.revisedDueDate = task.revisedDueDate || '2026-10-21';
    this.showDelayModal.set(true);
  }

  closeDelayModal(): void {
    this.showDelayModal.set(false);
    this.selectedTask.set(null);
  }

  submitDelayReport(): void {
    const task = this.selectedTask();
    if (!task || !this.delayReason.trim()) {
      alert('Please enter the reason for the delay.');
      return;
    }
    this.maintenanceService.reportDelay(task.id, this.delayReason, this.revisedDueDate);
    this.closeDelayModal();
    this.showToast(`Delay reported for task ${task.id}. Revised target: ${this.revisedDueDate}.`);
  }

  // Material Requisition
  openMaterialModal(task?: MaintenanceTask): void {
    if (task) {
      this.selectedTask.set(task);
      this.newMaterial.reason = `Required for task ${task.id} (${task.title})`;
    } else {
      this.selectedTask.set(null);
      this.newMaterial.reason = '';
    }
    this.newMaterial.itemName = '';
    this.newMaterial.quantity = '1 Unit';
    this.showMaterialModal.set(true);
  }

  closeMaterialModal(): void {
    this.showMaterialModal.set(false);
  }

  submitMaterialRequest(): void {
    if (!this.newMaterial.itemName.trim()) {
      alert('Please provide the tool or item name.');
      return;
    }
    const task = this.selectedTask();
    this.maintenanceService.requestMaterial({
      taskId: task?.id,
      taskTitle: task?.title,
      itemName: this.newMaterial.itemName,
      category: this.newMaterial.category,
      quantity: this.newMaterial.quantity,
      urgency: this.newMaterial.urgency,
      reason: this.newMaterial.reason || 'Routine repair replenishment.'
    });
    this.closeMaterialModal();
    this.showToast(`Requisition for "${this.newMaterial.itemName}" sent to Society Admin.`);
  }

  // Notifications
  toggleNotifications(): void {
    this.showNotificationsDrawer.set(!this.showNotificationsDrawer());
  }

  markAllRead(): void {
    this.maintenanceService.markAllNotificationsRead();
    this.showToast('All notifications marked as read.');
  }

  logout(): void {
    this.authService.logout();
  }
}
