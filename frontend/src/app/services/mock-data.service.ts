import { Injectable, signal } from '@angular/core';
import {
  Resident, Flat, Complaint, StaffMember, MaintenanceBill,
  Payment, Expense, Notice, Facility, FacilityBooking,
  Visitor, Activity, StatCard, PendingAction, NavItem, ToastNotification
} from '../models/models';

@Injectable({ providedIn: 'root' })
export class MockDataService {

  // ── Toast Notifications ──────────────────────────────────────────
  private toastSignal = signal<ToastNotification[]>([]);
  public toasts = this.toastSignal.asReadonly();

  showToast(toast: Omit<ToastNotification, 'id'>) {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast: ToastNotification = { id, ...toast };
    this.toastSignal.update(t => [...t, newToast]);
    setTimeout(() => this.removeToast(id), toast.duration ?? 4000);
  }

  removeToast(id: string) {
    this.toastSignal.update(t => t.filter(toast => toast.id !== id));
  }

  // ── Active Navigation Section ─────────────────────────────────────
  public activeSection = signal<string>('dashboard');

  setActiveSection(sectionId: string) {
    this.activeSection.set(sectionId);
  }

  // ── Navigation Items ─────────────────────────────────────────────
  getMainNavItems(): NavItem[] {
    return [
      { id: 'dashboard', label: 'Dashboard', icon: 'grid', route: '/dashboard' },
      { id: 'billing', label: 'Maintenance Bills', icon: 'credit-card', route: '/billing' },
      { id: 'complaints', label: 'Complaints', icon: 'alert-circle', route: '/complaints', badge: 12 },
      { id: 'buildings', label: 'Flat Information', icon: 'building', route: '/buildings' },
      { id: 'residents', label: 'Residents', icon: 'users', route: '/residents', badge: 3 },
      { id: 'facilities', label: 'Facility Booking', icon: 'calendar', route: '/facilities' },
      { id: 'visitors', label: 'Visitor Management', icon: 'user-check', route: '/visitors' },
    ];
  }

  getCommunityNavItems(): NavItem[] {
    return [
      { id: 'notices', label: 'Notice Board', icon: 'bell', route: '/notices' },
      { id: 'documents', label: 'Document Access', icon: 'folder', route: '/documents' },
      { id: 'staff', label: 'Staff Management', icon: 'briefcase', route: '/staff' },
      { id: 'expenses', label: 'Expenses & Dues', icon: 'trending-down', route: '/expenses' },
      { id: 'reports', label: 'Polls & Reports', icon: 'bar-chart-2', route: '/reports' },
      { id: 'settings', label: 'Society Settings', icon: 'settings', route: '/settings' },
    ];
  }

  getNavItems(): NavItem[] {
    return [...this.getMainNavItems(), ...this.getCommunityNavItems()];
  }

  // ── Statistics Cards ─────────────────────────────────────────────
  getStatCards(): StatCard[] {
    return [
      {
        id: 'total-flats',
        label: 'Total Flats',
        value: 240,
        change: 2.1,
        changeLabel: 'vs last month',
        icon: 'building',
        color: '#1D5245',
        bgColor: '#edf4f2',
      },
      {
        id: 'total-residents',
        label: 'Total Residents',
        value: 876,
        change: 1.8,
        changeLabel: 'vs last month',
        icon: 'users',
        color: '#71948F',
        bgColor: '#e8f0ef',
      },
      {
        id: 'open-complaints',
        label: 'Open Complaints',
        value: 12,
        change: -15.4,
        changeLabel: 'vs last month',
        icon: 'alert-circle',
        color: '#DC4545',
        bgColor: '#fdf1f1',
      },
      {
        id: 'maintenance-collection',
        label: 'Maintenance Collection',
        value: '₹18.4L',
        change: 8.2,
        changeLabel: 'vs last month',
        icon: 'trending-up',
        color: '#1D5245',
        bgColor: '#edf4f2',
      },
      {
        id: 'outstanding-dues',
        label: 'Outstanding Dues',
        value: '₹3.2L',
        change: -5.6,
        changeLabel: 'vs last month',
        icon: 'credit-card',
        color: '#F9CE60',
        bgColor: '#fef8eb',
      },
      {
        id: 'society-expenses',
        label: 'Society Expenses',
        value: '₹7.8L',
        change: 3.4,
        changeLabel: 'vs last month',
        icon: 'trending-down',
        color: '#17453A',
        bgColor: '#e8eeec',
      },
    ];
  }

  // ── Residents ────────────────────────────────────────────────────
  getResidents(): Resident[] {
    return [
      { id: 'R001', name: 'Ananya Sharma', email: 'ananya.sharma@email.com', phone: '+91 98765 43210', flatNumber: 'A-201', building: 'Block A', type: 'Owner', status: 'Active', joinDate: '2021-03-15' },
      { id: 'R002', name: 'Rohan Mehta', email: 'rohan.mehta@email.com', phone: '+91 87654 32109', flatNumber: 'B-304', building: 'Block B', type: 'Tenant', status: 'Active', joinDate: '2022-07-01' },
      { id: 'R003', name: 'Priya Patel', email: 'priya.patel@email.com', phone: '+91 76543 21098', flatNumber: 'C-102', building: 'Block C', type: 'Owner', status: 'Active', joinDate: '2020-11-20' },
      { id: 'R004', name: 'Vikram Singh', email: 'vikram.singh@email.com', phone: '+91 65432 10987', flatNumber: 'A-401', building: 'Block A', type: 'Owner', status: 'Pending', joinDate: '2026-10-01' },
      { id: 'R005', name: 'Divya Nair', email: 'divya.nair@email.com', phone: '+91 54321 09876', flatNumber: 'D-205', building: 'Block D', type: 'Tenant', status: 'Active', joinDate: '2023-01-10' },
      { id: 'R006', name: 'Arjun Kapoor', email: 'arjun.kapoor@email.com', phone: '+91 43210 98765', flatNumber: 'B-101', building: 'Block B', type: 'Owner', status: 'Pending', joinDate: '2026-10-05' },
      { id: 'R007', name: 'Meera Iyer', email: 'meera.iyer@email.com', phone: '+91 32109 87654', flatNumber: 'C-303', building: 'Block C', type: 'Tenant', status: 'Active', joinDate: '2022-04-18' },
    ];
  }

  // ── Flats ────────────────────────────────────────────────────────
  getFlats(): Flat[] {
    return [
      { id: 'F001', number: 'A-101', building: 'Block A', floor: 1, type: '2BHK', status: 'Occupied', resident: 'Kavya Reddy', area: 950 },
      { id: 'F002', number: 'A-201', building: 'Block A', floor: 2, type: '2BHK', status: 'Occupied', resident: 'Ananya Sharma', area: 950 },
      { id: 'F003', number: 'A-301', building: 'Block A', floor: 3, type: '3BHK', status: 'Vacant', area: 1250 },
      { id: 'F004', number: 'B-101', building: 'Block B', floor: 1, type: '1BHK', status: 'Occupied', resident: 'Arjun Kapoor', area: 650 },
      { id: 'F005', number: 'B-202', building: 'Block B', floor: 2, type: '2BHK', status: 'Under Maintenance', area: 900 },
      { id: 'F006', number: 'C-102', building: 'Block C', floor: 1, type: '3BHK', status: 'Occupied', resident: 'Priya Patel', area: 1200 },
    ];
  }

  // ── Staff Members ────────────────────────────────────────────────
  getStaffMembers(): StaffMember[] {
    return [
      { id: 'S001', name: 'Ramesh Kumar', role: 'Security Guard', department: 'Security', phone: '+91 99001 12345', status: 'Active' },
      { id: 'S002', name: 'Sunita Devi', role: 'Housekeeping', department: 'Maintenance', phone: '+91 99002 23456', status: 'Active' },
      { id: 'S003', name: 'Mohan Lal', role: 'Plumber', department: 'Maintenance', phone: '+91 99003 34567', status: 'Active' },
      { id: 'S004', name: 'Asha Rani', role: 'Gardener', department: 'Landscaping', phone: '+91 99004 45678', status: 'On Leave' },
      { id: 'S005', name: 'Deepak Yadav', role: 'Electrician', department: 'Maintenance', phone: '+91 99005 56789', status: 'Active' },
      { id: 'S006', name: 'Priti Sharma', role: 'Admin Assistant', department: 'Administration', phone: '+91 99006 67890', status: 'Active' },
    ];
  }

  // ── Complaints ───────────────────────────────────────────────────
  getComplaints(): Complaint[] {
    return [
      { id: 'CMP-001', title: 'Water Leakage in Bathroom', description: 'Continuous water leakage from bathroom ceiling causing damage to flooring.', residentName: 'Ananya Sharma', flatNumber: 'A-201', building: 'Block A', category: 'Plumbing', priority: 'High', status: 'Open', assignedStaff: 'Mohan Lal', createdAt: '2026-10-15T10:30:00', updatedAt: '2026-10-15T10:30:00' },
      { id: 'CMP-002', title: 'Elevator Not Working', description: 'The elevator in Block B has been out of service since yesterday morning.', residentName: 'Rohan Mehta', flatNumber: 'B-304', building: 'Block B', category: 'Electrical', priority: 'High', status: 'In Progress', assignedStaff: 'Deepak Yadav', createdAt: '2026-10-14T08:15:00', updatedAt: '2026-10-14T14:30:00' },
      { id: 'CMP-003', title: 'Street Light Flickering', description: 'The street light near parking area is flickering continuously at night.', residentName: 'Priya Patel', flatNumber: 'C-102', building: 'Block C', category: 'Electrical', priority: 'Medium', status: 'Open', createdAt: '2026-10-13T19:45:00', updatedAt: '2026-10-13T19:45:00' },
      { id: 'CMP-004', title: 'Garbage Not Collected', description: 'Garbage from the dustbin near Block D has not been collected for 3 days.', residentName: 'Divya Nair', flatNumber: 'D-205', building: 'Block D', category: 'Housekeeping', priority: 'Medium', status: 'Resolved', assignedStaff: 'Sunita Devi', createdAt: '2026-10-12T07:00:00', updatedAt: '2026-10-13T10:00:00' },
      { id: 'CMP-005', title: 'Parking Space Encroachment', description: 'Resident from A-401 is regularly parking in designated visitors area.', residentName: 'Meera Iyer', flatNumber: 'C-303', building: 'Block C', category: 'Parking', priority: 'Low', status: 'Open', createdAt: '2026-10-11T16:20:00', updatedAt: '2026-10-11T16:20:00' },
      { id: 'CMP-006', title: 'Pest Infestation in Common Area', description: 'Cockroaches spotted in the common corridor of Block A, ground floor.', residentName: 'Kavya Reddy', flatNumber: 'A-101', building: 'Block A', category: 'Housekeeping', priority: 'High', status: 'In Progress', assignedStaff: 'Sunita Devi', createdAt: '2026-10-10T11:00:00', updatedAt: '2026-10-11T09:00:00' },
      { id: 'CMP-007', title: 'Broken Gate Latch', description: 'The latch on the main entry gate is broken and does not lock properly.', residentName: 'Vikram Singh', flatNumber: 'A-401', building: 'Block A', category: 'Security', priority: 'High', status: 'Open', createdAt: '2026-10-09T14:00:00', updatedAt: '2026-10-09T14:00:00' },
      { id: 'CMP-008', title: 'Noise Complaint', description: 'Loud music from D-301 every night after 11 PM is disturbing residents.', residentName: 'Arjun Kapoor', flatNumber: 'B-101', building: 'Block B', category: 'Noise', priority: 'Medium', status: 'Resolved', assignedStaff: 'Ramesh Kumar', createdAt: '2026-10-08T23:30:00', updatedAt: '2026-10-09T08:00:00' },
    ];
  }

  // ── Maintenance Bills ─────────────────────────────────────────────
  getMaintenanceBills(): MaintenanceBill[] {
    return [
      { id: 'MB-001', flatNumber: 'A-201', building: 'Block A', residentName: 'Ananya Sharma', amount: 3500, month: 'October', year: 2026, status: 'Paid', dueDate: '2026-10-10', paidDate: '2026-10-08' },
      { id: 'MB-002', flatNumber: 'B-304', building: 'Block B', residentName: 'Rohan Mehta', amount: 3500, month: 'October', year: 2026, status: 'Pending', dueDate: '2026-10-10' },
      { id: 'MB-003', flatNumber: 'C-102', building: 'Block C', residentName: 'Priya Patel', amount: 4200, month: 'October', year: 2026, status: 'Paid', dueDate: '2026-10-10', paidDate: '2026-10-05' },
      { id: 'MB-004', flatNumber: 'D-205', building: 'Block D', residentName: 'Divya Nair', amount: 3800, month: 'September', year: 2026, status: 'Overdue', dueDate: '2026-09-10' },
      { id: 'MB-005', flatNumber: 'B-101', building: 'Block B', residentName: 'Arjun Kapoor', amount: 3000, month: 'September', year: 2026, status: 'Overdue', dueDate: '2026-09-10' },
    ];
  }

  // ── Payments ─────────────────────────────────────────────────────
  getPayments(): Payment[] {
    return [
      { id: 'PAY-001', flatNumber: 'A-201', residentName: 'Ananya Sharma', amount: 3500, date: '2026-10-08', type: 'Maintenance', method: 'UPI', status: 'Completed', reference: 'UPI20261008001' },
      { id: 'PAY-002', flatNumber: 'C-102', residentName: 'Priya Patel', amount: 4200, date: '2026-10-05', type: 'Maintenance', method: 'Bank Transfer', status: 'Completed', reference: 'NEFT20261005002' },
      { id: 'PAY-003', flatNumber: 'A-301', residentName: 'Vikash Gupta', amount: 5000, date: '2026-10-10', type: 'Facility Booking', method: 'UPI', status: 'Completed', reference: 'UPI20261010003' },
      { id: 'PAY-004', flatNumber: 'D-205', residentName: 'Divya Nair', amount: 3800, date: '2026-10-02', type: 'Maintenance', method: 'Cash', status: 'Pending', reference: 'CASH20261002004' },
    ];
  }

  // ── Expenses ─────────────────────────────────────────────────────
  getExpenses(): Expense[] {
    return [
      { id: 'EXP-001', title: 'Generator Fuel', category: 'Utilities', amount: 45000, date: '2026-10-01', vendor: 'City Oil Depot', approvedBy: 'Rahul Verma', status: 'Approved' },
      { id: 'EXP-002', title: 'Elevator AMC', category: 'Maintenance', amount: 120000, date: '2026-10-05', vendor: 'Otis Elevators', approvedBy: 'Rahul Verma', status: 'Approved' },
      { id: 'EXP-003', title: 'Swimming Pool Cleaning', category: 'Maintenance', amount: 18000, date: '2026-10-08', vendor: 'AquaClean Services', approvedBy: 'Rahul Verma', status: 'Pending' },
      { id: 'EXP-004', title: 'Garden Landscaping', category: 'Landscaping', amount: 35000, date: '2026-10-12', vendor: 'GreenThumb Co.', approvedBy: 'Rahul Verma', status: 'Approved' },
    ];
  }

  // ── Notices ──────────────────────────────────────────────────────
  getNotices(): Notice[] {
    return [
      { id: 'NOT-001', title: 'Water Supply Interruption', content: 'Water supply will be interrupted on 20th October from 10 AM to 2 PM for pipeline maintenance work.', type: 'Urgent', postedBy: 'Rahul Verma', postedAt: '2026-10-15T09:00:00', isPinned: true },
      { id: 'NOT-002', title: 'Diwali Celebration', content: 'The society is organizing a Diwali celebration on 29th October at 7 PM in the clubhouse. All residents are invited.', type: 'Event', postedBy: 'Rahul Verma', postedAt: '2026-10-10T11:00:00', isPinned: false },
      { id: 'NOT-003', title: 'Maintenance Due Reminder', content: 'Kindly clear your pending maintenance dues for September 2026 before 20th October to avoid penalties.', type: 'General', postedBy: 'Rahul Verma', postedAt: '2026-10-08T10:00:00', isPinned: true },
    ];
  }

  // ── Facilities ───────────────────────────────────────────────────
  getFacilities(): Facility[] {
    return [
      { id: 'FAC-001', name: 'Clubhouse', description: 'Fully air-conditioned banquet hall for events and celebrations.', capacity: 150, pricePerHour: 2000, status: 'Available', amenities: ['AC', 'Kitchen', 'Sound System', 'Projector'] },
      { id: 'FAC-002', name: 'Swimming Pool', description: 'Olympic-size swimming pool with changing rooms.', capacity: 50, pricePerHour: 500, status: 'Available', amenities: ['Lifeguard', 'Changing Rooms', 'Shower'] },
      { id: 'FAC-003', name: 'Gymnasium', description: 'Modern gym with cardio and strength training equipment.', capacity: 30, pricePerHour: 300, status: 'Available', amenities: ['Cardio Equipment', 'Weights', 'AC', 'Locker'] },
      { id: 'FAC-004', name: 'Tennis Court', description: 'Professional tennis court with flood lights.', capacity: 10, pricePerHour: 400, status: 'Booked', amenities: ['Flood Lights', 'Equipment Storage'] },
      { id: 'FAC-005', name: 'Badminton Court', description: 'Indoor badminton court with wooden flooring.', capacity: 8, pricePerHour: 300, status: 'Available', amenities: ['Wooden Floor', 'Lighting'] },
    ];
  }

  // ── Facility Bookings ────────────────────────────────────────────
  getFacilityBookings(): FacilityBooking[] {
    return [
      { id: 'BKG-001', facilityId: 'FAC-001', facilityName: 'Clubhouse', residentName: 'Ananya Sharma', flatNumber: 'A-201', date: '2026-10-20', startTime: '06:00 PM', endTime: '10:00 PM', amount: 8000, status: 'Confirmed', purpose: 'Birthday Party' },
      { id: 'BKG-002', facilityId: 'FAC-002', facilityName: 'Swimming Pool', residentName: 'Rohan Mehta', flatNumber: 'B-304', date: '2026-10-18', startTime: '07:00 AM', endTime: '09:00 AM', amount: 1000, status: 'Confirmed', purpose: 'Morning Swim' },
      { id: 'BKG-003', facilityId: 'FAC-004', facilityName: 'Tennis Court', residentName: 'Priya Patel', flatNumber: 'C-102', date: '2026-10-19', startTime: '05:00 PM', endTime: '07:00 PM', amount: 800, status: 'Pending', purpose: 'Tennis Match' },
      { id: 'BKG-004', facilityId: 'FAC-003', facilityName: 'Gymnasium', residentName: 'Vikram Singh', flatNumber: 'A-401', date: '2026-10-21', startTime: '06:00 AM', endTime: '08:00 AM', amount: 600, status: 'Pending', purpose: 'Workout Session' },
      { id: 'BKG-005', facilityId: 'FAC-005', facilityName: 'Badminton Court', residentName: 'Divya Nair', flatNumber: 'D-205', date: '2026-10-22', startTime: '04:00 PM', endTime: '06:00 PM', amount: 600, status: 'Confirmed', purpose: 'Badminton Game' },
    ];
  }

  // ── Visitors ─────────────────────────────────────────────────────
  getVisitors(): Visitor[] {
    return [
      { id: 'VIS-001', name: 'Raj Sharma', phone: '+91 98765 11111', purpose: 'Family Visit', hostResident: 'Ananya Sharma', flatNumber: 'A-201', checkIn: '2026-10-17T10:30:00', vehicleNumber: 'MH01AB1234', status: 'In' },
      { id: 'VIS-002', name: 'Neha Gupta', phone: '+91 98765 22222', purpose: 'Delivery', hostResident: 'Rohan Mehta', flatNumber: 'B-304', checkIn: '2026-10-17T11:15:00', checkOut: '2026-10-17T11:30:00', status: 'Out' },
      { id: 'VIS-003', name: 'Amit Joshi', phone: '+91 98765 33333', purpose: 'AC Repair', hostResident: 'Priya Patel', flatNumber: 'C-102', checkIn: '2026-10-17T14:00:00', vehicleNumber: 'MH02CD5678', status: 'In' },
    ];
  }

  // ── Activity Feed ────────────────────────────────────────────────
  getActivities(): Activity[] {
    return [
      { id: 'ACT-001', type: 'complaint', title: 'New Complaint Filed', description: 'Ananya Sharma filed a complaint about water leakage in A-201', timestamp: '2026-10-17T10:30:00', actor: 'Ananya Sharma', icon: 'alert-circle', color: '#DC4545' },
      { id: 'ACT-002', type: 'payment', title: 'Maintenance Payment Received', description: 'Priya Patel paid October maintenance of ₹4,200 via Bank Transfer', timestamp: '2026-10-17T09:15:00', actor: 'Priya Patel', icon: 'check-circle', color: '#1D5245' },
      { id: 'ACT-003', type: 'visitor', title: 'Visitor Checked In', description: 'Raj Sharma checked in to meet Ananya Sharma in A-201', timestamp: '2026-10-17T10:30:00', actor: 'Security Gate', icon: 'user-check', color: '#71948F' },
      { id: 'ACT-004', type: 'booking', title: 'Facility Booking Confirmed', description: 'Clubhouse booked by Ananya Sharma for Oct 20 — Birthday Party', timestamp: '2026-10-16T18:45:00', actor: 'Ananya Sharma', icon: 'calendar', color: '#17453A' },
      { id: 'ACT-005', type: 'notice', title: 'Notice Published', description: 'Water supply interruption notice posted for Oct 20th maintenance', timestamp: '2026-10-15T09:00:00', actor: 'Rahul Verma', icon: 'bell', color: '#F9CE60' },
      { id: 'ACT-006', type: 'resident', title: 'New Resident Request', description: 'Vikram Singh applied for residency at A-401 — awaiting approval', timestamp: '2026-10-15T14:30:00', actor: 'Vikram Singh', icon: 'user-plus', color: '#1D5245' },
      { id: 'ACT-007', type: 'maintenance', title: 'Complaint Resolved', description: 'Garbage collection complaint by Divya Nair resolved by Sunita Devi', timestamp: '2026-10-13T10:00:00', actor: 'Sunita Devi', icon: 'check-circle', color: '#1D5245' },
    ];
  }

  // ── Pending Actions ──────────────────────────────────────────────
  getPendingActions(): PendingAction[] {
    return [
      { id: 'PA-001', type: 'resident_approval', title: 'Resident Approvals', description: 'New residents awaiting approval', count: 2, priority: 'high', actionLabel: 'Review', icon: 'user-check' },
      { id: 'PA-002', type: 'unassigned_complaint', title: 'Unassigned Complaints', description: 'Complaints with no staff assigned', count: 4, priority: 'high', actionLabel: 'Assign', icon: 'alert-circle' },
      { id: 'PA-003', type: 'overdue_payment', title: 'Overdue Payments', description: 'Residents with overdue maintenance', count: 8, priority: 'medium', actionLabel: 'Follow Up', icon: 'credit-card' },
      { id: 'PA-004', type: 'pending_booking', title: 'Pending Bookings', description: 'Facility bookings awaiting confirmation', count: 2, priority: 'low', actionLabel: 'Confirm', icon: 'calendar' },
    ];
  }

  // ── Chart Data ───────────────────────────────────────────────────
  getMaintenanceChartData() {
    return {
      labels: ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
      collected: [14.2, 15.8, 13.5, 16.4, 17.1, 15.9, 18.4],
      target: [18, 18, 18, 18, 18, 18, 18],
    };
  }

  getComplaintChartData() {
    return {
      open: 12,
      inProgress: 5,
      resolved: 48,
      closed: 23,
    };
  }
}
