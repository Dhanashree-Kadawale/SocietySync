import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MockDataService } from '../../services/mock-data.service';
import { Complaint } from '../../models/models';

@Component({
  selector: 'app-complaints-table',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './complaints-table.html',
  styleUrl: './complaints-table.css'
})
export class ComplaintsTableComponent implements OnInit {
  allComplaints: Complaint[] = [];
  filtered: Complaint[] = [];
  searchQuery = '';
  filterStatus = 'all';
  filterPriority = 'all';
  showAssignModal = false;
  selectedComplaint: Complaint | null = null;

  statusOptions = ['all', 'Open', 'In Progress', 'Resolved', 'Closed'];
  priorityOptions = ['all', 'High', 'Medium', 'Low'];

  constructor(private mockData: MockDataService) {}

  ngOnInit() {
    this.allComplaints = this.mockData.getComplaints();
    this.filtered = [...this.allComplaints];
  }

  applyFilters() {
    this.filtered = this.allComplaints.filter(c => {
      const matchSearch = !this.searchQuery ||
        c.residentName.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        c.id.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        c.flatNumber.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        c.title.toLowerCase().includes(this.searchQuery.toLowerCase());
      const matchStatus = this.filterStatus === 'all' || c.status === this.filterStatus;
      const matchPriority = this.filterPriority === 'all' || c.priority === this.filterPriority;
      return matchSearch && matchStatus && matchPriority;
    });
  }

  onSearch() { this.applyFilters(); }
  onFilterStatus(val: string) { this.filterStatus = val; this.applyFilters(); }
  onFilterPriority(val: string) { this.filterPriority = val; this.applyFilters(); }

  openAssign(complaint: Complaint) {
    this.selectedComplaint = complaint;
    this.showAssignModal = true;
  }

  assignStaff(staff: string) {
    if (this.selectedComplaint) {
      this.selectedComplaint.assignedStaff = staff;
      this.selectedComplaint.status = 'In Progress';
      this.mockData.showToast({
        type: 'success',
        title: 'Staff Assigned',
        message: `${staff} assigned to ${this.selectedComplaint.id}`,
      });
    }
    this.showAssignModal = false;
  }

  resolveComplaint(complaint: Complaint) {
    complaint.status = 'Resolved';
    this.mockData.showToast({
      type: 'success',
      title: 'Complaint Resolved',
      message: `${complaint.id} marked as resolved`,
    });
  }

  getPriorityClass(priority: string): string {
    return 'priority-' + priority.toLowerCase();
  }

  getStatusClass(status: string): string {
    const map: Record<string, string> = {
      'Open': 'badge-open',
      'In Progress': 'badge-in-progress',
      'Resolved': 'badge-resolved',
      'Closed': 'badge-grey',
    };
    return map[status] || 'badge-grey';
  }

  formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  }
}
