import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ResidentService } from '../../services/resident.service';
import { AuthService } from '../../services/auth.service';
import {
  Complaint,
  FacilityBooking,
  MaintenanceBill,
  Notice,
  PaymentRecord,
  Visitor,
  FeedbackSubmission
} from '../../models/user.model';

export type ResidentTab =
  | 'overview'
  | 'bills'
  | 'complaints'
  | 'flat'
  | 'facilities'
  | 'visitors'
  | 'notices'
  | 'documents'
  | 'polls'
  | 'feedback'
  | 'profile';

@Component({
  selector: 'app-resident-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './resident-dashboard.component.html',
  styleUrl: './resident-dashboard.component.css'
})
export class ResidentDashboardComponent {
  // Navigation tabs
  activeTab = signal<ResidentTab>('overview');

  // Search filter
  searchQuery = signal<string>('');

  // Modals & Drawers
  showPayModal = signal<boolean>(false);
  showComplaintModal = signal<boolean>(false);
  showBookingModal = signal<boolean>(false);
  showVisitorModal = signal<boolean>(false);
  showFeedbackModal = signal<boolean>(false);
  showNoticeModal = signal<boolean>(false);
  showReceiptModal = signal<boolean>(false);
  showNotificationsDrawer = signal<boolean>(false);

  // Active items for modals
  selectedBillForPayment = signal<MaintenanceBill | null>(null);
  selectedNotice = signal<Notice | null>(null);
  selectedReceipt = signal<PaymentRecord | null>(null);

  // Toast alert
  toastMessage = signal<string | null>(null);

  // Form states:
  // 1. Payment Form
  paymentMethod = signal<'UPI' | 'Credit Card' | 'Debit Card' | 'Net Banking'>('UPI');
  upiId = signal<string>('resident@okhdfcbank');
  isPaying = signal<boolean>(false);
  paymentSuccess = signal<boolean>(false);

  // Dynamic Logged-in User Profile
  readonly residentUser = computed(() => this.authService.currentUser());
  readonly residentName = computed(() => this.residentUser()?.name || 'Resident');
  readonly residentEmail = computed(() => this.residentUser()?.email || 'resident@greenwood.com');
  readonly residentPhone = computed(() => this.residentUser()?.phone || '+91 98765 12340');
  readonly residentFlat = computed(() => this.residentUser()?.flat || this.residentService.flatInfo().flatNumber);
  readonly residentTower = computed(() => {
    const flat = this.residentFlat();
    if (flat.includes('Tower B') || flat.startsWith('B-')) return 'Tower B';
    if (flat.includes('Tower C') || flat.startsWith('C-')) return 'Tower C';
    return 'Tower A';
  });
  readonly residentSociety = computed(() => this.residentUser()?.societyName || 'Greenwood Heights');
  readonly residentInitials = computed(() => {
    const name = this.residentName();
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  });
  readonly residentShortName = computed(() => {
    const name = this.residentName();
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return `${parts[0]} ${parts[1][0]}.`;
    }
    return name;
  });

  // 2. Complaint Form
  newComplaint = {
    title: '',
    category: 'Plumbing' as Complaint['category'],
    priority: 'Medium' as Complaint['priority'],
    description: ''
  };

  // 3. Facility Booking Form
  newBooking = {
    facilityName: 'Clubhouse' as FacilityBooking['facilityName'],
    date: '2026-10-25',
    timeSlot: '05:00 PM - 09:00 PM',
    guestsCount: 15,
    specialRequests: ''
  };

  // 4. Visitor Pre-approval Form
  newVisitor = {
    name: '',
    phone: '',
    purpose: 'Guest' as Visitor['purpose'],
    date: '2026-10-18',
    time: '05:00 PM',
    vehicleNumber: ''
  };

  // 5. Feedback Form
  feedbackForm = {
    category: 'Amenities' as FeedbackSubmission['category'],
    subject: '',
    message: '',
    rating: 5
  };

  // 6. Profile Edit Form
  profileForm = {
    emergencyName: '',
    emergencyPhone: '',
    emergencyRelation: ''
  };

  constructor(
    public residentService: ResidentService,
    public authService: AuthService,
    private router: Router
  ) {
    // Initialize profile form with current flat info
    const info = this.residentService.flatInfo();
    this.profileForm = {
      emergencyName: info.emergencyContact.name,
      emergencyPhone: info.emergencyContact.phone,
      emergencyRelation: info.emergencyContact.relationship
    };
  }

  // Set active tab
  setTab(tab: string): void {
    const validTabs: ResidentTab[] = [
      'overview',
      'bills',
      'complaints',
      'flat',
      'facilities',
      'visitors',
      'notices',
      'documents',
      'polls',
      'feedback',
      'profile'
    ];
    if (validTabs.includes(tab as ResidentTab)) {
      this.activeTab.set(tab as ResidentTab);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  showToast(msg: string): void {
    this.toastMessage.set(msg);
    setTimeout(() => {
      this.toastMessage.set(null);
    }, 3500);
  }

  // --- 1. BILLS & PAYMENTS ---
  openPayModal(bill: MaintenanceBill): void {
    this.selectedBillForPayment.set(bill);
    this.paymentSuccess.set(false);
    this.isPaying.set(false);
    this.showPayModal.set(true);
  }

  closePayModal(): void {
    this.showPayModal.set(false);
    this.selectedBillForPayment.set(null);
  }

  executePayment(): void {
    const bill = this.selectedBillForPayment();
    if (!bill) return;

    this.isPaying.set(true);
    setTimeout(() => {
      const receipt = this.residentService.payBill(bill.id, this.paymentMethod());
      this.isPaying.set(false);
      this.paymentSuccess.set(true);
      this.selectedReceipt.set(receipt);
      this.showToast(`₹${bill.totalAmount} paid successfully for ${bill.month}!`);
    }, 1200);
  }

  viewReceipt(receipt: PaymentRecord): void {
    this.selectedReceipt.set(receipt);
    this.showReceiptModal.set(true);
  }

  closeReceiptModal(): void {
    this.showReceiptModal.set(false);
    this.selectedReceipt.set(null);
  }

  downloadReceiptPdf(receipt: PaymentRecord): void {
    this.showToast(`Downloading receipt ${receipt.receiptNumber} as PDF...`);
  }

  // --- 2. COMPLAINTS ---
  openComplaintModal(): void {
    this.newComplaint = {
      title: '',
      category: 'Plumbing',
      priority: 'Medium',
      description: ''
    };
    this.showComplaintModal.set(true);
  }

  closeComplaintModal(): void {
    this.showComplaintModal.set(false);
  }

  submitComplaint(): void {
    if (!this.newComplaint.title.trim()) {
      alert('Please enter a complaint title');
      return;
    }
    this.residentService.addComplaint({
      title: this.newComplaint.title,
      category: this.newComplaint.category,
      priority: this.newComplaint.priority,
      description: this.newComplaint.description || 'Reported via resident portal.'
    });
    this.closeComplaintModal();
    this.showToast('Complaint registered successfully! Assigned to maintenance team.');
  }

  // --- 3. FACILITY BOOKINGS ---
  openBookingModal(facilityName?: FacilityBooking['facilityName']): void {
    if (facilityName) {
      this.newBooking.facilityName = facilityName;
    }
    this.showBookingModal.set(true);
  }

  closeBookingModal(): void {
    this.showBookingModal.set(false);
  }

  submitBooking(): void {
    const feeMap: Record<FacilityBooking['facilityName'], number> = {
      'Clubhouse': 1500,
      'Community Hall': 3000,
      'Swimming Pool': 0,
      'Tennis Court': 0,
      'Gymnasium': 0,
      'Barbeque Deck': 800
    };

    this.residentService.bookFacility({
      facilityName: this.newBooking.facilityName,
      date: this.newBooking.date,
      timeSlot: this.newBooking.timeSlot,
      guestsCount: this.newBooking.guestsCount,
      bookingFee: feeMap[this.newBooking.facilityName] || 0,
      specialRequests: this.newBooking.specialRequests
    });
    this.closeBookingModal();
    this.showToast(`Reservation confirmed for ${this.newBooking.facilityName}!`);
  }

  // --- 4. VISITORS ---
  openVisitorModal(): void {
    this.newVisitor = {
      name: '',
      phone: '',
      purpose: 'Guest',
      date: '2026-10-18',
      time: '05:00 PM',
      vehicleNumber: ''
    };
    this.showVisitorModal.set(true);
  }

  closeVisitorModal(): void {
    this.showVisitorModal.set(false);
  }

  submitVisitor(): void {
    if (!this.newVisitor.name.trim()) {
      alert('Please enter the visitor name.');
      return;
    }
    this.residentService.registerVisitor({
      name: this.newVisitor.name,
      phone: this.newVisitor.phone,
      purpose: this.newVisitor.purpose,
      date: this.newVisitor.date,
      time: this.newVisitor.time,
      vehicleNumber: this.newVisitor.vehicleNumber
    });
    this.closeVisitorModal();
    this.showToast(`Expected visitor ${this.newVisitor.name} registered with entry pass!`);
  }

  approveVisitor(id: string): void {
    this.residentService.approveVisitorEntry(id);
    this.showToast('Visitor entry approved! Gate security notified.');
  }

  denyVisitor(id: string): void {
    this.residentService.denyVisitorEntry(id);
    this.showToast('Visitor entry denied.');
  }

  // --- 5. NOTICES ---
  openNotice(notice: Notice): void {
    this.selectedNotice.set(notice);
    this.showNoticeModal.set(true);
  }

  closeNoticeModal(): void {
    this.showNoticeModal.set(false);
    this.selectedNotice.set(null);
  }

  // --- 6. POLLS ---
  voteInPoll(pollId: string, optionId: string): void {
    this.residentService.castVote(pollId, optionId);
    this.showToast('Your vote has been recorded securely!');
  }

  // --- 7. FEEDBACK ---
  openFeedbackModal(): void {
    this.feedbackForm = {
      category: 'Amenities',
      subject: '',
      message: '',
      rating: 5
    };
    this.showFeedbackModal.set(true);
  }

  closeFeedbackModal(): void {
    this.showFeedbackModal.set(false);
  }

  submitFeedback(): void {
    if (!this.feedbackForm.subject.trim() || !this.feedbackForm.message.trim()) {
      alert('Please provide a subject and message.');
      return;
    }
    this.residentService.submitFeedback(this.feedbackForm);
    this.closeFeedbackModal();
    this.showToast('Thank you! Your suggestion was submitted to society management.');
  }

  // --- 8. PROFILE UPDATE ---
  saveProfileChanges(): void {
    this.residentService.updateProfileDetails({
      emergencyName: this.profileForm.emergencyName,
      emergencyPhone: this.profileForm.emergencyPhone,
      emergencyRelation: this.profileForm.emergencyRelation
    });
    this.showToast('Profile and emergency contact updated successfully!');
  }

  // --- 9. NOTIFICATIONS ---
  toggleNotifications(): void {
    this.showNotificationsDrawer.set(!this.showNotificationsDrawer());
  }

  markAllRead(): void {
    this.residentService.markAllNotificationsRead();
    this.showToast('All notifications marked as read.');
  }

  // --- LOGOUT ---
  logout(): void {
    this.authService.logout();
  }
}
