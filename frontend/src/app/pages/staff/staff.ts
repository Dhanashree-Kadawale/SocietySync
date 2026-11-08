import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MockDataService } from '../../services/mock-data.service';

export interface DetailedStaff {
  id: string;
  name: string;
  role: string;
  department: 'Security' | 'Maintenance' | 'Housekeeping' | 'Landscaping' | 'Administration';
  phone: string;
  shift: string;
  status: 'On Duty' | 'Off Duty' | 'On Leave';
  salary: number;
  assignedArea: string;
  emergencyContact: string;
  idVerified: boolean;
  rating: number;
  activeTasks: number;
}

@Component({
  selector: 'app-staff',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './staff.html',
  styleUrl: './staff.css'
})
export class StaffPageComponent implements OnInit {
  public mockData = inject(MockDataService);

  public staffList = computed<DetailedStaff[]>(() => {
    return this.mockData.staffMembers().map((s, idx) => ({
      id: s.id.startsWith('STF') ? s.id : ('STF-00' + (s.id.replace(/\D/g, '') || (idx + 1))),
      name: s.name,
      role: s.role,
      department: (s.department || 'Maintenance') as any,
      phone: s.phone,
      shift: '08:00 AM - 04:00 PM (Day)',
      status: (s.status === 'Active' ? 'On Duty' : 'On Leave') as any,
      salary: 18000 + (idx * 1500),
      assignedArea: 'Tower A & Common Areas',
      emergencyContact: '+91 98221 0000' + (idx + 1),
      idVerified: true,
      rating: 4.8,
      activeTasks: 2
    }));
  });

  // Filters
  public selectedDept = signal<string>('ALL');
  public selectedStatus = signal<string>('ALL');
  public searchQuery = signal<string>('');
  public viewMode = signal<'grid' | 'table'>('grid');

  // Modals & Details
  public showAddStaffModal = signal<boolean>(false);
  public showDetailModal = signal<boolean>(false);
  public activeStaff = signal<DetailedStaff | null>(null);

  // Form
  public staffForm: any = {
    name: '',
    role: '',
    department: 'Security',
    phone: '',
    shift: '08:00 AM - 04:00 PM',
    salary: 18000,
    assignedArea: 'Tower A',
    emergencyContact: '',
    idVerified: true
  };

  ngOnInit() {}

  public filteredStaff = computed(() => {
    let list = this.staffList();
    const dept = this.selectedDept();
    const stat = this.selectedStatus();
    const q = this.searchQuery().toLowerCase().trim();

    if (dept !== 'ALL') {
      list = list.filter(s => s.department === dept);
    }

    if (stat !== 'ALL') {
      list = list.filter(s => s.status === stat);
    }

    if (q) {
      list = list.filter(s =>
        s.name.toLowerCase().includes(q) ||
        s.role.toLowerCase().includes(q) ||
        s.phone.toLowerCase().includes(q) ||
        s.assignedArea.toLowerCase().includes(q) ||
        s.id.toLowerCase().includes(q)
      );
    }

    return list;
  });

  // KPI Computations
  public totalStaffCount = computed(() => this.staffList().length);
  public onDutyCount = computed(() => this.staffList().filter(s => s.status === 'On Duty').length);
  public onLeaveCount = computed(() => this.staffList().filter(s => s.status === 'On Leave').length);
  public monthlyPayroll = computed(() => {
    const total = this.staffList().reduce((sum, s) => sum + s.salary, 0);
    return `₹${(total / 1000).toFixed(1)}K`;
  });

  openAddStaffModal() {
    this.staffForm = {
      name: '',
      role: '',
      department: 'Security',
      phone: '',
      shift: '08:00 AM - 04:00 PM (Morning)',
      salary: 18000,
      assignedArea: 'Tower A & Common Areas',
      emergencyContact: '',
      idVerified: true
    };
    this.showAddStaffModal.set(true);
  }

  closeAddStaffModal() {
    this.showAddStaffModal.set(false);
  }

  submitStaff() {
    if (!this.staffForm.name.trim() || !this.staffForm.phone.trim() || !this.staffForm.role.trim()) {
      this.mockData.showToast({
        type: 'error',
        title: 'Validation Error',
        message: 'Please fill name, role, and contact phone number.'
      });
      return;
    }

    this.mockData.addStaff({
      name: this.staffForm.name,
      role: this.staffForm.role,
      department: this.staffForm.department,
      phone: this.staffForm.phone,
      status: 'Active'
    });
    this.closeAddStaffModal();
  }

  toggleDutyStatus(staff: DetailedStaff, event?: Event) {
    if (event) event.stopPropagation();
    const nextStatus = staff.status === 'On Duty' ? 'Off Duty' : staff.status === 'Off Duty' ? 'On Leave' : 'On Duty';
    staff.status = nextStatus;

    this.mockData.showToast({
      type: 'info',
      title: 'Duty Status Updated',
      message: `${staff.name} is now marked as "${nextStatus}".`
    });
  }

  viewStaffDetails(staff: DetailedStaff) {
    this.activeStaff.set(staff);
    this.showDetailModal.set(true);
  }

  closeDetailModal() {
    this.showDetailModal.set(false);
    this.activeStaff.set(null);
  }

  callStaff(staff: DetailedStaff, event?: Event) {
    if (event) event.stopPropagation();
    this.mockData.showToast({
      type: 'info',
      title: 'Connecting Call',
      message: `Dialing ${staff.name} (${staff.phone})...`
    });
  }

  getInitials(name: string): string {
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  }
}
