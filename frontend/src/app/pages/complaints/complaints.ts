import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MockDataService } from '../../services/mock-data.service';
import { Complaint, StaffMember } from '../../models/models';

@Component({
  selector: 'app-complaints-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './complaints.html',
  styleUrl: './complaints.css'
})
export class ComplaintsPageComponent implements OnInit {
  public mockData = inject(MockDataService);

  public complaints = signal<Complaint[]>([]);
  public staffList = signal<StaffMember[]>([]);

  public searchQuery = signal<string>('');
  public selectedStatus = signal<string>('ALL');
  public selectedPriority = signal<string>('ALL');
  public selectedCategory = signal<string>('ALL');

  // Modals
  public showCreateModal = signal<boolean>(false);
  public showAssignModal = signal<boolean>(false);
  public showDetailModal = signal<boolean>(false);
  public selectedComplaint = signal<Complaint | null>(null);

  // Forms
  public complaintForm = {
    title: '',
    description: '',
    flatNumber: 'A-201',
    building: 'Block A',
    residentName: 'Ananya Sharma',
    category: 'Plumbing',
    priority: 'High' as 'High' | 'Medium' | 'Low'
  };

  public assignForm = {
    assignedStaff: 'Mohan Lal',
    note: ''
  };

  ngOnInit() {
    this.complaints.set(this.mockData.getComplaints());
    this.staffList.set(this.mockData.getStaffMembers());
  }

  // Filtered list
  public filteredComplaints = computed(() => {
    let list = this.complaints();
    const q = this.searchQuery().toLowerCase().trim();
    const status = this.selectedStatus();
    const priority = this.selectedPriority();
    const cat = this.selectedCategory();

    if (q) {
      list = list.filter(c =>
        c.title.toLowerCase().includes(q) ||
        c.flatNumber.toLowerCase().includes(q) ||
        c.residentName.toLowerCase().includes(q) ||
        c.id.toLowerCase().includes(q)
      );
    }
    if (status !== 'ALL') list = list.filter(c => c.status === status);
    if (priority !== 'ALL') list = list.filter(c => c.priority === priority);
    if (cat !== 'ALL') list = list.filter(c => c.category === cat);
    return list;
  });

  // KPIs
  public totalCount = computed(() => this.complaints().length);
  public openCount = computed(() => this.complaints().filter(c => c.status === 'Open').length);
  public inProgressCount = computed(() => this.complaints().filter(c => c.status === 'In Progress').length);
  public resolvedCount = computed(() => this.complaints().filter(c => c.status === 'Resolved').length);

  // Actions
  openCreateModal() {
    this.showCreateModal.set(true);
  }

  closeCreateModal() {
    this.showCreateModal.set(false);
  }

  saveComplaint() {
    if (!this.complaintForm.title) return;
    const newId = `CMP-0${this.complaints().length + 1}`;
    const newCmp: Complaint = {
      id: newId,
      title: this.complaintForm.title,
      description: this.complaintForm.description,
      flatNumber: this.complaintForm.flatNumber,
      building: this.complaintForm.building,
      residentName: this.complaintForm.residentName,
      category: this.complaintForm.category,
      priority: this.complaintForm.priority,
      status: 'Open',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.complaints.update(prev => [newCmp, ...prev]);
    this.mockData.showToast({
      type: 'success',
      title: 'Complaint Registered',
      message: `Ticket #${newId} registered and assigned to committee queue.`
    });
    this.closeCreateModal();
  }

  openAssignModal(c: Complaint) {
    this.selectedComplaint.set(c);
    this.assignForm.assignedStaff = c.assignedStaff || 'Mohan Lal';
    this.showAssignModal.set(true);
  }

  closeAssignModal() {
    this.showAssignModal.set(false);
  }

  confirmAssign() {
    const c = this.selectedComplaint();
    if (!c) return;
    this.complaints.update(prev =>
      prev.map(item => item.id === c.id ? { ...item, assignedStaff: this.assignForm.assignedStaff, status: 'In Progress' } : item)
    );
    this.mockData.showToast({
      type: 'info',
      title: 'Staff Assigned',
      message: `Ticket #${c.id} assigned to ${this.assignForm.assignedStaff}.`
    });
    this.closeAssignModal();
  }

  updateStatus(c: Complaint, newStatus: 'Open' | 'In Progress' | 'Resolved' | 'Closed') {
    this.complaints.update(prev =>
      prev.map(item => item.id === c.id ? { ...item, status: newStatus, updatedAt: new Date().toISOString() } : item)
    );
    this.mockData.showToast({
      type: 'success',
      title: 'Status Updated',
      message: `Ticket #${c.id} marked as ${newStatus}.`
    });
  }

  viewDetails(c: Complaint) {
    this.selectedComplaint.set(c);
    this.showDetailModal.set(true);
  }

  closeDetailModal() {
    this.showDetailModal.set(false);
  }
}
