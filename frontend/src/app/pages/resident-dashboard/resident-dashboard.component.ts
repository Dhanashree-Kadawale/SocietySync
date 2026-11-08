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
  SocietyDocument,
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
  upiId = signal<string>('priya@okhdfcbank');
  isPaying = signal<boolean>(false);
  paymentSuccess = signal<boolean>(false);

  // 2. Complaint Form
  newComplaint = {
    title: '',
    category: 'Plumbing' as Complaint['category'],
    priority: 'Medium' as Complaint['priority'],
    description: ''
  };

  // 3. Facility Booking Form
  newBooking = {
    facilityId: '',
    facilityName: '' as FacilityBooking['facilityName'],
    date: new Date().toISOString().slice(0, 10),
    timeSlot: '05:00 PM - 09:00 PM',
    guestsCount: 15,
    specialRequests: ''
  };

  // 4. Visitor Pre-approval Form
  newVisitor = {
    name: '',
    phone: '',
    purpose: 'Guest' as Visitor['purpose'],
    date: new Date().toISOString().slice(0, 10),
    time: '17:00',
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

  get userInitials(): string {
    const name = this.authService.currentUser()?.name || 'Resident';
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  }

  get userName(): string {
    return this.authService.currentUser()?.name || 'Resident';
  }

  get userShortName(): string {
    const parts = (this.authService.currentUser()?.name || 'Resident').trim().split(/\s+/);
    return parts.length > 1 ? `${parts[0]} ${parts[1][0]}.` : parts[0];
  }

  get userEmail(): string {
    return this.authService.currentUser()?.email || '';
  }

  get userPhone(): string {
    return this.authService.currentUser()?.phone || '';
  }

  get userFlat(): string {
    return this.authService.currentUser()?.flat || '';
  }

  get societyName(): string {
    return this.authService.currentUser()?.societyName || '';
  }

  get nearestUnpaidBill(): MaintenanceBill | undefined {
    return this.residentService.bills()
      .filter(bill => bill.status !== 'Paid')
      .sort((left, right) => left.dueDate.localeCompare(right.dueDate))[0];
  }

  get expectedVisitors(): Visitor[] {
    return this.residentService.visitors().filter(visitor =>
      visitor.status === 'Expected' || visitor.status === 'Approved'
    );
  }

  get activeComplaint(): Complaint | undefined {
    return this.residentService.complaints().find(complaint =>
      complaint.status !== 'Resolved' && complaint.status !== 'Closed'
    );
  }

  get upcomingBooking(): FacilityBooking | undefined {
    return this.residentService.bookings().find(booking =>
      booking.status === 'Confirmed' || booking.status === 'Pending Approval'
    );
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
    this.residentService.payBill(bill.id, this.paymentMethod()).subscribe({
      next: receipt => {
      this.isPaying.set(false);
      this.paymentSuccess.set(true);
      this.selectedReceipt.set(receipt);
      this.showToast(`Payment record saved for ${bill.month}. No external payment was processed.`);
      },
      error: error => {
        this.isPaying.set(false);
        this.showToast(error?.error?.message || error?.message || 'Payment failed. Please try again.');
      }
    });
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
    if (!receipt.receiptUrl) {
      this.showToast('A receipt file is not available for this payment yet.');
      return;
    }
    window.open(receipt.receiptUrl, '_blank', 'noopener');
  }

  downloadBillReceipt(bill: MaintenanceBill): void {
    const receipt = this.residentService.paymentHistory().find(payment =>
      payment.billId === bill.id && payment.receiptUrl
    );
    if (receipt) {
      this.downloadReceiptPdf(receipt);
      return;
    }
    this.showToast('A receipt file is not available for this bill yet.');
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
    }).subscribe({
      next: response => {
        if (!response.success) {
          this.showToast(response.message || 'Complaint could not be registered.');
          return;
        }
        this.closeComplaintModal();
        this.showToast('Complaint registered successfully.');
      },
      error: error => this.showToast(error?.error?.message || error?.message || 'Complaint could not be registered.')
    });
  }

  // --- 3. FACILITY BOOKINGS ---
  openBookingModal(facilityIdentifier?: string): void {
    const facilities = this.residentService.facilities();
    const selected = facilities.find(facility =>
      facility.id === facilityIdentifier || facility.name === facilityIdentifier
    ) || facilities.find(facility => facility.status === 'AVAILABLE');
    if (!selected || selected.status !== 'AVAILABLE') {
      this.showToast('There are no available facilities to book.');
      return;
    }
    this.newBooking.facilityId = selected.id;
    this.newBooking.facilityName = selected.name;
    this.showBookingModal.set(true);
  }

  closeBookingModal(): void {
    this.showBookingModal.set(false);
  }

  submitBooking(): void {
    const facility = this.residentService.facilities().find(item => item.id === this.newBooking.facilityId);
    if (!facility || facility.status !== 'AVAILABLE') {
      this.showToast('Choose an available facility before submitting.');
      return;
    }

    this.residentService.bookFacility({
      facilityId: facility.id,
      facilityName: facility.name,
      date: this.newBooking.date,
      timeSlot: this.newBooking.timeSlot,
      guestsCount: this.newBooking.guestsCount,
      specialRequests: this.newBooking.specialRequests
    }).subscribe({
      next: response => {
        if (!response.success) {
          this.showToast(response.message || 'Booking could not be submitted.');
          return;
        }
        this.closeBookingModal();
        this.showToast(`Booking request submitted for ${this.newBooking.facilityName}; awaiting approval.`);
      },
      error: error => this.showToast(error?.error?.message || error?.message || 'Booking could not be submitted.')
    });
  }

  // --- 4. VISITORS ---
  openVisitorModal(): void {
    this.newVisitor = {
      name: '',
      phone: '',
      purpose: 'Guest',
      date: new Date().toISOString().slice(0, 10),
      time: '17:00',
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
    }).subscribe({
      next: response => {
        if (!response.success) {
          this.showToast(response.message || 'Visitor could not be registered.');
          return;
        }
        this.closeVisitorModal();
        this.showToast(`Expected visitor ${this.newVisitor.name} registered.`);
      },
      error: error => this.showToast(error?.error?.message || error?.message || 'Visitor could not be registered.')
    });
  }

  approveVisitor(id: string): void {
    this.residentService.approveVisitorEntry(id).subscribe({
      next: response => response.success
        ? this.showToast('Visitor entry approved.')
        : this.showToast(response.message || 'Visitor entry could not be approved.'),
      error: error => this.showToast(error?.error?.message || error?.message || 'Visitor entry could not be approved.')
    });
  }

  denyVisitor(id: string): void {
    this.residentService.denyVisitorEntry(id).subscribe({
      next: response => response.success
        ? this.showToast('Visitor entry denied.')
        : this.showToast(response.message || 'Visitor entry could not be denied.'),
      error: error => this.showToast(error?.error?.message || error?.message || 'Visitor entry could not be denied.')
    });
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

  downloadDocument(doc: SocietyDocument): void {
    if (!doc.fileUrl) {
      this.showToast('No download link has been added for this document yet.');
      return;
    }
    window.open(doc.fileUrl, '_blank', 'noopener');
  }

  // --- 6. POLLS ---
  voteInPoll(pollId: string, optionId: string): void {
    this.residentService.castVote(pollId, optionId).subscribe({
      next: response => response.success
        ? this.showToast('Your vote has been recorded.')
        : this.showToast(response.message || 'Your vote could not be recorded.'),
      error: error => this.showToast(error?.error?.message || error?.message || 'Your vote could not be recorded.')
    });
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
    this.residentService.submitFeedback(this.feedbackForm).subscribe({
      next: response => {
        if (!response.success) {
          this.showToast(response.message || 'Feedback could not be submitted.');
          return;
        }
        this.closeFeedbackModal();
        this.showToast('Feedback submitted to society management.');
      },
      error: error => this.showToast(error?.error?.message || error?.message || 'Feedback could not be submitted.')
    });
  }

  // --- 8. PROFILE UPDATE ---
  saveProfileChanges(): void {
    this.residentService.updateProfileDetails({
      emergencyName: this.profileForm.emergencyName,
      emergencyPhone: this.profileForm.emergencyPhone,
      emergencyRelation: this.profileForm.emergencyRelation
    });
    this.showToast('Emergency contact updates are not saved yet; this feature requires a backend profile endpoint.');
  }

  // --- 9. NOTIFICATIONS ---
  toggleNotifications(): void {
    this.showNotificationsDrawer.set(!this.showNotificationsDrawer());
  }

  markAllRead(): void {
    this.residentService.markAllNotificationsRead().subscribe({
      next: response => response.success
        ? this.showToast('All notifications marked as read.')
        : this.showToast(response.message || 'Notifications could not be updated.'),
      error: error => this.showToast(error?.error?.message || error?.message || 'Notifications could not be updated.')
    });
  }

  // --- LOGOUT ---
  logout(): void {
    this.authService.logout();
  }
}
