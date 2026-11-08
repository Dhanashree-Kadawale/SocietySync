export type UserRole = 'Resident' | 'Secretary Admin' | 'Super Admin' | 'Maintenance Staff';

export interface User {
  id: string;
  userId?: number;
  residentId?: number;
  societyId?: number;
  name: string;
  email: string;
  phone: string;
  flat: string;
  role: UserRole;
  societyName: string;
  avatar?: string;
  token?: string;
}

export interface LoginRequest {
  identity: string; // Email or Mobile Number
  password: string;
  role: UserRole;
  rememberMe: boolean;
}

export interface FlatInfo {
  wing: string;
  flatNumber: string;
  floor: number;
  bhkType: string;
  carpetAreaSqFt: number;
  parkingSlot: string;
  ownershipType: 'Owner' | 'Tenant' | '';
  residentSince: string;
  occupancyCount: number;
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
  vehicles: {
    type: 'Car' | 'Two-Wheeler';
    model: string;
    registrationNumber: string;
    slot: string;
  }[];
}

export interface Complaint {
  id: string;
  title: string;
  category: 'Plumbing' | 'Electrical' | 'Lift' | 'Carpentry' | 'Civil' | 'Housekeeping' | 'Security' | 'General';
  description: string;
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
  status: 'Reported' | 'Assigned' | 'In Progress' | 'Resolved' | 'Closed';
  dateReported: string;
  flat: string;
  assignedStaff?: {
    name: string;
    phone: string;
    role: string;
  };
  resolutionNote?: string;
  resolvedDate?: string;
}

export interface MaintenanceBill {
  id: string;
  billNumber: string;
  month: string;
  dueDate: string;
  issuedDate: string;
  baseAmount: number;
  sinkingFund: number;
  waterCharges: number;
  parkingCharges: number;
  penalty: number;
  totalAmount: number;
  status: 'Unpaid' | 'Paid' | 'Overdue';
  paidDate?: string;
  paymentMode?: string;
  receiptNumber?: string;
}

export interface PaymentRecord {
  id: string;
  receiptNumber: string;
  billId: string;
  billMonth: string;
  amount: number;
  paymentDate: string;
  paymentMethod: 'UPI' | 'Credit Card' | 'Debit Card' | 'Net Banking';
  transactionId: string;
  status: 'Success' | 'Processing' | 'Failed';
  receiptUrl?: string;
}

export interface FacilityBooking {
  id: string;
  facilityName: string;
  date: string;
  timeSlot: string;
  guestsCount: number;
  status: 'Confirmed' | 'Pending Approval' | 'Completed' | 'Cancelled';
  bookingFee: number;
  specialRequests?: string;
  createdAt: string;
}

export interface ResidentFacility {
  id: string;
  name: string;
  description: string;
  capacity: number;
  pricePerHour: number;
  status: string;
  amenities: string;
  imageUrl?: string;
}

export interface Visitor {
  id: string;
  name: string;
  phone: string;
  purpose: 'Guest' | 'Delivery' | 'Cab' | 'Service Provider' | 'Home Repair';
  date: string;
  time: string;
  vehicleNumber?: string;
  entryPassCode: string;
  status: 'Expected' | 'Checked In' | 'Approved' | 'Denied' | 'Checked Out';
  flat: string;
  registeredAt: string;
}

export interface Notice {
  id: string;
  title: string;
  category: 'General' | 'Maintenance' | 'Emergency' | 'Celebration' | 'Rules';
  date: string;
  content: string;
  priority: 'High' | 'Normal';
  issuedBy: string;
  attachments?: string[];
}

export interface SocietyDocument {
  id: string;
  title: string;
  category: 'Bylaws & Rules' | 'AGM Minutes' | 'Financial & Audit' | 'NOC Forms' | 'Guidelines';
  fileSize: string;
  fileType: 'PDF' | 'DOCX';
  uploadedDate: string;
  description: string;
  fileUrl?: string;
}

export interface PollOption {
  id: string;
  text: string;
  votes: number;
}

export interface Poll {
  id: string;
  title: string;
  description: string;
  category: string;
  endDate: string;
  options: PollOption[];
  totalVotes: number;
  userVotedOptionId?: string;
  status: 'Active' | 'Closed';
}

export interface FeedbackSubmission {
  id: string;
  category: 'Maintenance' | 'Security' | 'Cleanliness' | 'Amenities' | 'Management' | 'General Suggestion';
  subject: string;
  message: string;
  rating: number; // 1-5
  submittedDate: string;
  status: 'Under Review' | 'Acknowledged' | 'Action Taken';
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  category: 'Bill' | 'Complaint' | 'Visitor' | 'Notice' | 'Facility';
  timestamp: string;
  isRead: boolean;
  linkTab?: string;
}

export type TaskStatus = 'Assigned' | 'Accepted' | 'In Progress' | 'Resolved' | 'Delayed' | 'Issue Reported';

export interface RepairPhoto {
  id: string;
  url: string;
  type: 'before' | 'after';
  caption: string;
  timestamp: string;
}

export interface MaintenanceTask {
  id: string;
  complaintId: string;
  title: string;
  category: 'Plumbing' | 'Electrical' | 'Lift' | 'Carpentry' | 'Civil' | 'Housekeeping' | 'Security';
  flat: string;
  wing: string;
  residentName: string;
  residentPhone: string;
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
  status: TaskStatus;
  assignedDate: string;
  dueDate: string;
  description: string;
  workNotes?: string;
  materialsUsed?: string[];
  photos?: RepairPhoto[];
  delayReason?: string;
  revisedDueDate?: string;
  assignmentIssueReason?: string;
  completedDate?: string;
  timeSpentHours?: number;
  residentRating?: number;
}

export interface MaterialRequest {
  id: string;
  taskId?: string;
  taskTitle?: string;
  itemName: string;
  category: 'Tools' | 'Electrical' | 'Plumbing' | 'Hardware' | 'Chemicals/Paint';
  quantity: string;
  urgency: 'Low' | 'Normal' | 'High' | 'Emergency';
  reason: string;
  status: 'Pending' | 'Approved' | 'Issued' | 'Rejected';
  requestDate: string;
  adminRemarks?: string;
}

export interface StaffNotification {
  id: string;
  title: string;
  message: string;
  type: 'Assignment' | 'Material' | 'Reminder' | 'Admin Note';
  timestamp: string;
  isRead: boolean;
  taskId?: string;
}
