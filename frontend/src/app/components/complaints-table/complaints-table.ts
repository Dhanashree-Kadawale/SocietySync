import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
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
  searchQuery = '';
  filterStatus = 'all';
  filterPriority = 'all';
  showAssignModal = false;
  selectedComplaint: Complaint | null = null;

  statusOptions = ['all', 'Open', 'In Progress', 'Resolved', 'Closed'];
  priorityOptions = ['all', 'High', 'Medium', 'Low'];

  constructor(
    public mockData: MockDataService,
    private router: Router
  ) {}

  navigateTo(route: string) {
    this.router.navigate([route]);
  }

  ngOnInit() {}

  get allComplaints(): Complaint[] {
    return this.mockData.complaints();
  }

  get filtered(): Complaint[] {
    return this.allComplaints.filter(c => {
      const matchSearch = !this.searchQuery ||
        (c.residentName && c.residentName.toLowerCase().includes(this.searchQuery.toLowerCase())) ||
        (c.id && c.id.toLowerCase().includes(this.searchQuery.toLowerCase())) ||
        (c.flatNumber && c.flatNumber.toLowerCase().includes(this.searchQuery.toLowerCase())) ||
        (c.title && c.title.toLowerCase().includes(this.searchQuery.toLowerCase()));
      const matchStatus = this.filterStatus === 'all' || c.status === this.filterStatus;
      const matchPriority = this.filterPriority === 'all' || c.priority === this.filterPriority;
      return matchSearch && matchStatus && matchPriority;
    });
  }

  onSearch() {}
  onFilterStatus(val: string) { this.filterStatus = val; }
  onFilterPriority(val: string) { this.filterPriority = val; }

  openAssign(complaint: Complaint) {
    this.selectedComplaint = complaint;
    this.showAssignModal = true;
  }

  assignStaff(staff: string) {
    if (this.selectedComplaint) {
      this.mockData.updateComplaintStatus(this.selectedComplaint.id, 'In Progress', staff);
    }
    this.showAssignModal = false;
  }

  resolveComplaint(complaint: Complaint) {
    this.mockData.updateComplaintStatus(complaint.id, 'Resolved');
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
