// =====================================================
// SocietySync — Domain Models / Interfaces
// =====================================================

export interface Resident {
  id: string;
  name: string;
  email: string;
  phone: string;
  flatNumber: string;
  building: string;
  type: 'Owner' | 'Tenant';
  status: 'Active' | 'Pending' | 'Inactive';
  joinDate: string;
  avatar?: string;
}

export interface Flat {
  id: string;
  number: string;
  flatNumber?: string;
  building: string;
  floor: number;
  type: '1BHK' | '2BHK' | '3BHK' | '4BHK' | 'Penthouse' | string;
  status: 'Occupied' | 'Vacant' | 'Under Maintenance';
  resident?: string;
  area: number;
  parkingSlot?: string;
  intercomNumber?: string;
  residentPhone?: string;
  ownerName?: string;
  ownerPhone?: string;
  [key: string]: any;
}

export interface Complaint {
  id: string;
  title: string;
  description: string;
  residentName: string;
  flatNumber: string;
  building: string;
  category: string;
  priority: 'High' | 'Medium' | 'Low';
  status: 'Open' | 'In Progress' | 'Resolved' | 'Closed';
  assignedStaff?: string;
  createdAt: string;
  updatedAt: string;
}

export interface StaffMember {
  id: string;
  name: string;
  role: string;
  department: string;
  phone: string;
  status: 'Active' | 'On Leave' | 'Inactive';
  avatar?: string;
}

export interface MaintenanceBill {
  id: string;
  flatNumber: string;
  building: string;
  residentName: string;
  amount: number;
  month: string;
  year: number;
  status: 'Paid' | 'Pending' | 'Overdue';
  dueDate: string;
  paidDate?: string;
}

export interface Payment {
  id: string;
  billId?: number;
  flatNumber: string;
  residentName: string;
  amount: number;
  date: string;
  type: 'Maintenance' | 'Penalty' | 'Facility Booking' | 'Other';
  method: 'UPI' | 'Bank Transfer' | 'Cash' | 'Cheque';
  status: 'Completed' | 'Pending' | 'Failed';
  reference: string;
}

export interface Expense {
  id: string;
  title: string;
  category: string;
  amount: number;
  date: string;
  vendor: string;
  approvedBy: string;
  status: 'Approved' | 'Pending' | 'Rejected';
  receipt?: string;
}

export interface Notice {
  id: string;
  title: string;
  content: string;
  type: 'General' | 'Urgent' | 'Maintenance' | 'Event';
  postedBy: string;
  postedAt: string;
  expiresAt?: string;
  isPinned: boolean;
}

export interface Facility {
  id: string;
  name: string;
  description: string;
  capacity: number;
  pricePerHour: number;
  status: 'Available' | 'Booked' | 'Under Maintenance';
  image?: string;
  amenities: string[];
}

export interface FacilityBooking {
  id: string;
  facilityId: string;
  facilityName: string;
  facilityImage?: string;
  residentName: string;
  flatNumber: string;
  date: string;
  startTime: string;
  endTime: string;
  amount: number;
  status: 'Confirmed' | 'Pending' | 'Cancelled';
  purpose: string;
}

export interface Visitor {
  id: string;
  name: string;
  phone: string;
  purpose: string;
  hostResident: string;
  flatNumber: string;
  checkIn: string;
  checkOut?: string;
  vehicleNumber?: string;
  status: 'In' | 'Out';
}

export interface Activity {
  id: string;
  type: 'complaint' | 'payment' | 'notice' | 'visitor' | 'booking' | 'resident' | 'maintenance';
  title: string;
  description: string;
  timestamp: string;
  actor: string;
  icon: string;
  color: string;
}

export interface StatCard {
  id: string;
  label: string;
  value: string | number;
  change: number;
  changeLabel: string;
  icon: string;
  color: string;
  bgColor: string;
  prefix?: string;
  suffix?: string;
}

export interface PendingAction {
  id: string;
  type: 'resident_approval' | 'unassigned_complaint' | 'overdue_payment' | 'pending_booking';
  title: string;
  description: string;
  count: number;
  priority: 'high' | 'medium' | 'low';
  actionLabel: string;
  icon: string;
}

export interface ToastNotification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  duration?: number;
}

export interface NavItem {
  id: string;
  label: string;
  icon: string;
  route: string;
  badge?: number;
  children?: NavItem[];
}

export interface SocietyDoc {
  id: string;
  title: string;
  category: 'Legal' | 'AGM' | 'Financial' | 'Safety' | 'Forms' | string;
  format: 'PDF' | 'DOCX' | 'XLSX' | string;
  fileSize: string;
  uploadedAt: string;
  uploadedBy: string;
  accessLevel: 'All Residents' | 'Committee Only' | 'Confidential' | string;
  description: string;
  downloadCount: number;
}
