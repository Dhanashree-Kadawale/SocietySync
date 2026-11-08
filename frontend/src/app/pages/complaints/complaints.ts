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
export class ComplaintsPageComponent {
  public mockData = inject(MockDataService);

  public complaints = this.mockData.complaints;
  public staffList = this.mockData.staffMembers;

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
    this.mockData.addComplaint({
      title: this.complaintForm.title,
      description: this.complaintForm.description,
      flatNumber: this.complaintForm.flatNumber,
      building: this.complaintForm.building,
      residentName: this.complaintForm.residentName,
      category: this.complaintForm.category,
      priority: this.complaintForm.priority,
      status: 'Open'
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
    this.mockData.updateComplaint(c.id, { assignedStaff: this.assignForm.assignedStaff, status: 'In Progress' });
    this.closeAssignModal();
  }

  updateStatus(c: Complaint, newStatus: 'Open' | 'In Progress' | 'Resolved' | 'Closed') {
    this.mockData.updateComplaint(c.id, { status: newStatus });
  }

  viewDetails(c: Complaint) {
    this.selectedComplaint.set(c);
    this.showDetailModal.set(true);
  }

  closeDetailModal() {
    this.showDetailModal.set(false);
  }
}
