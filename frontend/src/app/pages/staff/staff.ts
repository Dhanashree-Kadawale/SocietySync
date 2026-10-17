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

  public staffList = signal<DetailedStaff[]>([
    {
      id: 'STF-001',
      name: 'Ramesh Kumar',
      role: 'Head Security Guard',
      department: 'Security',
      phone: '+91 99001 12345',
      shift: '07:00 AM - 03:00 PM (Morning)',
      status: 'On Duty',
      salary: 19500,
      assignedArea: 'Main Gate 1 & Perimeter',
      emergencyContact: '+91 98221 00001 (Brother)',
      idVerified: true,
      rating: 4.8,
      activeTasks: 3
    },
    {
      id: 'STF-002',
      name: 'Sunita Devi',
      role: 'Housekeeping Supervisor',
      department: 'Housekeeping',
      phone: '+91 99002 23456',
      shift: '08:00 AM - 04:00 PM (Day)',
      status: 'On Duty',
      salary: 17000,
      assignedArea: 'Tower A & Tower B Corridors',
      emergencyContact: '+91 98221 00002 (Spouse)',
      idVerified: true,
      rating: 4.9,
      activeTasks: 2
    },
    {
      id: 'STF-003',
      name: 'Mohan Lal',
      role: 'Chief Plumber & Water Specialist',
      department: 'Maintenance',
      phone: '+91 99003 34567',
      shift: '09:00 AM - 06:00 PM (General)',
      status: 'On Duty',
      salary: 22000,
      assignedArea: 'Pumping Station & All Towers',
      emergencyContact: '+91 98221 00003 (Son)',
      idVerified: true,
      rating: 4.7,
      activeTasks: 4
    },
    {
      id: 'STF-004',
      name: 'Asha Rani',
      role: 'Head Landscaper & Gardener',
      department: 'Landscaping',
      phone: '+91 99004 45678',
      shift: '07:00 AM - 02:00 PM (Morning)',
      status: 'On Leave',
      salary: 15500,
      assignedArea: 'Central Park & Clubhouse Gardens',
      emergencyContact: '+91 98221 00004 (Spouse)',
      idVerified: true,
      rating: 4.6,
      activeTasks: 0
    },
    {
      id: 'STF-005',
      name: 'Deepak Yadav',
      role: 'Senior Electrician & DG Operator',
      department: 'Maintenance',
      phone: '+91 99005 56789',
      shift: '10:00 AM - 07:00 PM (Evening)',
      status: 'On Duty',
      salary: 23500,
      assignedArea: 'Substation, Transformers & DG Sets',
      emergencyContact: '+91 98221 00005 (Father)',
      idVerified: true,
      rating: 4.9,
      activeTasks: 5
    },
    {
      id: 'STF-006',
      name: 'Priti Sharma',
      role: 'Society Admin & Accounts Clerk',
      department: 'Administration',
      phone: '+91 99006 67890',
      shift: '10:00 AM - 06:00 PM (Office)',
      status: 'On Duty',
      salary: 26000,
      assignedArea: 'Society Office & Reception',
      emergencyContact: '+91 98221 00006 (Spouse)',
      idVerified: true,
      rating: 5.0,
      activeTasks: 1
    },
    {
      id: 'STF-007',
      name: 'Vikram Jadhav',
      role: 'Night Security Guard',
      department: 'Security',
      phone: '+91 99007 78901',
      shift: '11:00 PM - 07:00 AM (Night)',
      status: 'Off Duty',
      salary: 19000,
      assignedArea: 'Basement Parking & Gate 2',
      emergencyContact: '+91 98221 00007 (Brother)',
      idVerified: true,
      rating: 4.7,
      activeTasks: 1
    },
    {
      id: 'STF-008',
      name: 'Kailash Chander',
      role: 'Waste & Garbage Collector',
      department: 'Housekeeping',
      phone: '+91 99008 89012',
      shift: '06:30 AM - 02:30 PM (Morning)',
      status: 'On Duty',
      salary: 15000,
      assignedArea: 'Tower C & Tower D Corridors',
      emergencyContact: '+91 98221 00008 (Father)',
      idVerified: true,
      rating: 4.5,
      activeTasks: 1
    }
  ]);

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

    const newStaff: DetailedStaff = {
      id: 'STF-0' + (this.staffList().length + 1),
      name: this.staffForm.name,
      role: this.staffForm.role,
      department: this.staffForm.department,
      phone: this.staffForm.phone,
      shift: this.staffForm.shift,
      status: 'On Duty',
      salary: Number(this.staffForm.salary) || 18000,
      assignedArea: this.staffForm.assignedArea || 'General Society Premises',
      emergencyContact: this.staffForm.emergencyContact || 'Not specified',
      idVerified: this.staffForm.idVerified,
      rating: 5.0,
      activeTasks: 0
    };

    this.staffList.update(list => [newStaff, ...list]);
    this.closeAddStaffModal();
    this.mockData.showToast({
      type: 'success',
      title: 'Staff Member Onboarded',
      message: `${newStaff.name} registered under ${newStaff.department} department.`
    });
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
