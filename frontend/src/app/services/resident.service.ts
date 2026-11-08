import { Injectable, signal, computed, inject } from '@angular/core';
import { interval, Observable, Subscription, throwError } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { ApiResponse, ApiService } from './api.service';
import { AuthService } from './auth.service';
import {
  FlatInfo,
  Complaint,
  MaintenanceBill,
  PaymentRecord,
  FacilityBooking,
  Visitor,
  Notice,
  SocietyDocument,
  Poll,
  FeedbackSubmission,
  NotificationItem,
  ResidentFacility
} from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class ResidentService {
  private api = inject(ApiService);
  private authService = inject(AuthService, { optional: true });
  private refreshSubscription?: Subscription;

  constructor() {
    this.authService?.authStateChanged$.subscribe(user => {
      this.refreshSubscription?.unsubscribe();
      if (!user) {
        this.clearResidentData();
        return;
      }

      this.clearResidentData();
      if (user.flat) {
        this.flatInfo.update(f => ({
          ...f,
          flatNumber: user.flat,
          wing: user.flat.split('-')[0]
        }));
      }
      this.syncFromBackend();
      this.refreshSubscription = interval(15000).subscribe(() => this.syncFromBackend());
    });
  }

  // 1. Flat & Profile Info
  readonly flatInfo = signal<FlatInfo>({
    wing: '',
    flatNumber: '',
    floor: 0,
    bhkType: '',
    carpetAreaSqFt: 0,
    parkingSlot: '',
    ownershipType: '',
    residentSince: '',
    occupancyCount: 0,
    emergencyContact: {
      name: '',
      relationship: '',
      phone: ''
    },
    vehicles: []
  });

  // 2. Complaints
  readonly complaints = signal<Complaint[]>([]);

  // 3. Maintenance Bills
  readonly bills = signal<MaintenanceBill[]>([]);

  // 4. Payment Records
  readonly paymentHistory = signal<PaymentRecord[]>([]);

  // 5. Facility Bookings
  readonly bookings = signal<FacilityBooking[]>([]);
  readonly facilities = signal<ResidentFacility[]>([]);

  // 6. Visitor Management
  readonly visitors = signal<Visitor[]>([]);

  // 7. Notice Board
  readonly notices = signal<Notice[]>([]);

  // 8. Documents & Bylaws
  readonly documents = signal<SocietyDocument[]>([]);

  // 9. Polls & Surveys
  readonly polls = signal<Poll[]>([]);

  // 10. Feedbacks
  readonly feedbacks = signal<FeedbackSubmission[]>([]);

  // 11. Notifications
  readonly notifications = signal<NotificationItem[]>([]);

  // Computed summary metrics for Dashboard
  readonly unpaidBillCount = computed(() => this.bills().filter(b => b.status !== 'Paid').length);
  readonly totalDueAmount = computed(() =>
    this.bills()
      .filter(b => b.status !== 'Paid')
      .reduce((sum, b) => sum + b.totalAmount, 0)
  );
  readonly activeComplaintCount = computed(() =>
    this.complaints().filter(c => c.status !== 'Resolved' && c.status !== 'Closed').length
  );
  readonly upcomingBookingCount = computed(() =>
    this.bookings().filter(b => b.status === 'Confirmed' || b.status === 'Pending Approval').length
  );
  readonly unreadNotificationCount = computed(() =>
    this.notifications().filter(n => !n.isRead).length
  );

  private clearResidentData(): void {
    this.complaints.set([]);
    this.bills.set([]);
    this.paymentHistory.set([]);
    this.bookings.set([]);
    this.facilities.set([]);
    this.visitors.set([]);
    this.notices.set([]);
    this.documents.set([]);
    this.polls.set([]);
    this.feedbacks.set([]);
    this.notifications.set([]);
    this.flatInfo.set({
      wing: '',
      flatNumber: '',
      floor: 0,
      bhkType: '',
      carpetAreaSqFt: 0,
      parkingSlot: '',
      ownershipType: '',
      residentSince: '',
      occupancyCount: 0,
      emergencyContact: { name: '', relationship: '', phone: '' },
      vehicles: []
    });
  }

  private mapPriority(value: string): Complaint['priority'] {
    const priority = value?.toUpperCase();
    if (priority === 'LOW') return 'Low';
    if (priority === 'HIGH') return 'High';
    if (priority === 'URGENT') return 'Urgent';
    return 'Medium';
  }

  private mapComplaintCategory(value: string): Complaint['category'] {
    const category = value?.toUpperCase();
    if (category === 'ELECTRICAL') return 'Electrical';
    if (category === 'LIFT') return 'Lift';
    if (category === 'CARPENTRY') return 'Carpentry';
    if (category === 'CIVIL') return 'Civil';
    if (category === 'HOUSEKEEPING') return 'Housekeeping';
    if (category === 'SECURITY') return 'Security';
    if (category === 'GENERAL') return 'General';
    return 'Plumbing';
  }

  private mapComplaintStatus(value: string): Complaint['status'] {
    const status = value?.toUpperCase();
    if (status === 'ASSIGNED') return 'Assigned';
    if (status === 'IN_PROGRESS') return 'In Progress';
    if (status === 'RESOLVED') return 'Resolved';
    if (status === 'CLOSED') return 'Closed';
    return 'Reported';
  }

  private mapBillStatus(value: string): MaintenanceBill['status'] {
    if (value === 'PAID') return 'Paid';
    if (value === 'OVERDUE') return 'Overdue';
    return 'Unpaid';
  }

  private mapBookingStatus(value: string): FacilityBooking['status'] {
    if (value === 'APPROVED' || value === 'CONFIRMED') return 'Confirmed';
    if (value === 'COMPLETED') return 'Completed';
    if (value === 'CANCELLED' || value === 'REJECTED') return 'Cancelled';
    return 'Pending Approval';
  }

  private mapVisitorStatus(value: string): Visitor['status'] {
    if (value === 'CHECKED_IN') return 'Checked In';
    if (value === 'APPROVED') return 'Approved';
    if (value === 'DENIED') return 'Denied';
    if (value === 'CHECKED_OUT') return 'Checked Out';
    return 'Expected';
  }

  private mapVisitorPurpose(value: string): Visitor['purpose'] {
    if (value === 'SERVICE_PROVIDER') return 'Service Provider';
    if (value === 'HOME_REPAIR') return 'Home Repair';
    if (value === 'DELIVERY') return 'Delivery';
    if (value === 'CAB') return 'Cab';
    return 'Guest';
  }

  private mapNoticeCategory(value: string): Notice['category'] {
    if (value === 'MAINTENANCE') return 'Maintenance';
    if (value === 'EMERGENCY') return 'Emergency';
    if (value === 'CELEBRATION') return 'Celebration';
    if (value === 'RULES') return 'Rules';
    return 'General';
  }

  private mapDocumentCategory(value: string): SocietyDocument['category'] {
    if (value === 'AGM_MINUTES') return 'AGM Minutes';
    if (value === 'FINANCIAL_AUDIT') return 'Financial & Audit';
    if (value === 'NOC_FORMS') return 'NOC Forms';
    if (value === 'BYLAWS_RULES') return 'Bylaws & Rules';
    return 'Guidelines';
  }

  private mapNotificationCategory(value: string): NotificationItem['category'] {
    if (value === 'BILL') return 'Bill';
    if (value === 'COMPLAINT') return 'Complaint';
    if (value === 'VISITOR') return 'Visitor';
    if (value === 'FACILITY') return 'Facility';
    return 'Notice';
  }

  private mapFeedbackCategory(value: string): FeedbackSubmission['category'] {
    if (value === 'MAINTENANCE') return 'Maintenance';
    if (value === 'SECURITY') return 'Security';
    if (value === 'CLEANLINESS') return 'Cleanliness';
    if (value === 'AMENITIES') return 'Amenities';
    if (value === 'MANAGEMENT') return 'Management';
    return 'General Suggestion';
  }

  private parseId(value: string, prefix: string): number {
    const match = new RegExp(`^${prefix}-(\\d+)$`).exec(value);
    return match ? Number(match[1]) : NaN;
  }

  private parseTime(value: string): string {
    const match = /^(\d{1,2}):(\d{2})\s*(AM|PM)$/i.exec(value.trim());
    if (!match) return '';
    let hour = Number(match[1]) % 12;
    if (match[3].toUpperCase() === 'PM') hour += 12;
    return `${String(hour).padStart(2, '0')}:${match[2]}:00`;
  }

  private timeToMinutes(value: string): number {
    const [hour, minute] = value.split(':').map(Number);
    return hour * 60 + minute;
  }

  // Live Database Sync
  public syncFromBackend() {
    const user = this.authService?.currentUser();
    if (!user) return;

    const societyId = user.societyId;
    if (!user.userId || !user.residentId || !societyId) {
      console.error('Resident data cannot be loaded because the account is missing user, resident, or society IDs.');
      return;
    }
    const userFlat = user.flat?.trim().toUpperCase();
    const userName = user.name.trim().toLowerCase();
    const matchesUser = (record: any) =>
      (userFlat && record.flatNumber?.trim().toUpperCase() === userFlat) ||
      (record.residentName?.trim().toLowerCase() === userName) ||
      (record.hostResidentName?.trim().toLowerCase() === userName);

    // 1. Complaints
    this.api.getComplaints(societyId, user.residentId).subscribe({
      next: (res) => {
        if (res?.success) {
          const filtered = (res.data || []).filter(matchesUser);
          const mapped: Complaint[] = filtered.map((c: any) => ({
            id: 'CMP-' + c.id,
            title: c.title,
            description: c.description || '',
            category: this.mapComplaintCategory(c.category),
            priority: this.mapPriority(c.priority),
            status: this.mapComplaintStatus(c.status),
            dateReported: c.createdAt ? new Date(c.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '',
            flat: c.flatNumber || user.flat || '',
            assignedStaff: c.assignedStaffName ? { name: c.assignedStaffName, phone: '', role: 'Maintenance Technician' } : undefined
          }));
          this.complaints.set(mapped);
        } else {
          console.error('Unable to load resident complaints:', res?.message);
        }
      },
      error: error => console.error('Unable to load resident complaints:', error)
    });

    // 2. Notices
    this.api.getNotices(societyId).subscribe({
      next: (res) => {
        if (res?.success) {
          const mapped: Notice[] = (res.data || []).map((n: any) => ({
            id: 'NOTICE-' + n.id,
            title: n.title,
            category: this.mapNoticeCategory(n.category),
            priority: (n.priority === 'HIGH' ? 'High' : 'Normal') as any,
            date: n.postedAt ? new Date(n.postedAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '',
            issuedBy: n.authorName || '',
            content: n.content || ''
          }));
          this.notices.set(mapped);
        } else {
          console.error('Unable to load resident notices:', res?.message);
        }
      },
      error: error => console.error('Unable to load resident notices:', error)
    });

    // 3. Visitors
    this.api.getVisitors(societyId).subscribe({
      next: (res) => {
        if (res?.success) {
          const filtered = (res.data || []).filter(matchesUser);
          const mapped: Visitor[] = filtered.map((v: any) => ({
            id: 'VIS-' + v.id,
            name: v.name,
            phone: v.phone || '',
            purpose: this.mapVisitorPurpose(v.purpose),
            date: v.expectedVisitAt ? new Date(v.expectedVisitAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '',
            time: v.expectedVisitAt ? new Date(v.expectedVisitAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : '',
            vehicleNumber: v.vehicleNumber || undefined,
            entryPassCode: v.entryPassCode || '',
            status: this.mapVisitorStatus(v.status),
            flat: v.flatNumber || user.flat || '',
            registeredAt: v.createdAt ? new Date(v.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : ''
          }));
          this.visitors.set(mapped);
        } else {
          console.error('Unable to load resident visitors:', res?.message);
        }
      },
      error: error => console.error('Unable to load resident visitors:', error)
    });

    // 4. Bills
    this.api.getBills(societyId, user.residentId).subscribe({
      next: (res) => {
        if (res?.success) {
          const filtered = (res.data || []).filter(matchesUser);
          const mapped: MaintenanceBill[] = filtered.map((b: any) => ({
            id: 'BILL-' + b.id,
            billNumber: b.billNumber || `BILL-${b.id}`,
            month: [b.billingMonth, b.billingYear].filter(Boolean).join(' '),
            dueDate: b.dueDate || '',
            issuedDate: b.issuedDate || '',
            baseAmount: Number(b.baseAmount) || 0,
            sinkingFund: Number(b.sinkingFund) || 0,
            parkingCharges: Number(b.parkingCharges) || 0,
            waterCharges: Number(b.waterCharges) || 0,
            penalty: Number(b.penaltyAmount) || 0,
            totalAmount: Number(b.totalAmount) || 0,
            status: this.mapBillStatus(b.status),
            paidDate: b.paidDate,
            paymentMode: b.paymentMode,
            receiptNumber: b.receiptNumber
          }));
          this.bills.set(mapped);
        } else {
          console.error('Unable to load resident bills:', res?.message);
        }
      },
      error: error => console.error('Unable to load resident bills:', error)
    });

    // 5. Bookings
    this.api.getBookings(societyId, user.residentId).subscribe({
      next: (res) => {
        if (res?.success) {
          const filtered = (res.data || []).filter(matchesUser);
          const mapped: FacilityBooking[] = filtered.map((b: any) => ({
            id: 'BKG-' + b.id,
            facilityName: b.facilityName,
            date: b.bookingDate || '',
            timeSlot: [b.startTime, b.endTime].filter(Boolean).join(' - '),
            status: this.mapBookingStatus(b.status),
            bookingFee: Number(b.bookingFee) || 0,
            guestsCount: Number(b.guestsCount) || 0,
            specialRequests: b.specialRequests || '',
            createdAt: b.createdAt || ''
          }));
          this.bookings.set(mapped);
        } else {
          console.error('Unable to load resident bookings:', res?.message);
        }
      },
      error: error => console.error('Unable to load resident bookings:', error)
    });

    this.api.getFacilities(societyId).subscribe({
      next: res => {
        if (res?.success) {
          this.facilities.set((res.data || []).map((facility: any) => ({
            id: String(facility.id),
            name: facility.name,
            description: facility.description || '',
            capacity: Number(facility.capacity) || 0,
            pricePerHour: Number(facility.pricePerHour) || 0,
            status: facility.status || '',
            amenities: facility.amenities || '',
            imageUrl: facility.imageUrl || undefined
          })));
        } else {
          console.error('Unable to load society facilities:', res?.message);
        }
      },
      error: error => console.error('Unable to load society facilities:', error)
    });

    this.api.getPayments(societyId, user.residentId).subscribe({
      next: res => {
        if (res?.success) {
          this.paymentHistory.set((res.data || []).filter(matchesUser).map((payment: any) => ({
            id: `PAY-${payment.id}`,
            receiptNumber: payment.receiptNumber || '',
            billId: payment.billId ? `BILL-${payment.billId}` : '',
            billMonth: [payment.billingMonth, payment.billingYear].filter(Boolean).join(' '),
            amount: Number(payment.amount) || 0,
            paymentDate: payment.paymentDate || '',
            paymentMethod: payment.paymentMethod,
            transactionId: payment.transactionId || '',
            status: payment.status === 'SUCCESS' ? 'Success' : payment.status === 'FAILED' ? 'Failed' : 'Processing',
            receiptUrl: payment.receiptUrl || undefined
          })));
        } else {
          console.error('Unable to load resident payment history:', res?.message);
        }
      },
      error: error => console.error('Unable to load resident payment history:', error)
    });

    this.api.getDocuments(societyId).subscribe({
      next: res => {
        if (res?.success) {
          this.documents.set((res.data || []).map((document: any) => ({
            id: `DOC-${document.id}`,
            title: document.title,
            category: this.mapDocumentCategory(document.category),
            fileSize: document.fileSize || '',
            fileType: document.fileType === 'DOCX' ? 'DOCX' : 'PDF',
            uploadedDate: document.createdAt ? new Date(document.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '',
            description: document.description || '',
            fileUrl: document.fileUrl || undefined
          })));
        } else {
          console.error('Unable to load society documents:', res?.message);
        }
      },
      error: error => console.error('Unable to load society documents:', error)
    });

    this.api.getPolls(societyId, user.userId).subscribe({
      next: res => {
        if (res?.success) {
          this.polls.set((res.data || []).map((poll: any) => ({
            id: `POLL-${poll.id}`,
            title: poll.title,
            description: poll.description || '',
            category: poll.category || '',
            endDate: poll.endDate || '',
            totalVotes: Number(poll.totalVotes) || 0,
            userVotedOptionId: poll.userVotedOptionId ? `OPT-${poll.userVotedOptionId}` : undefined,
            status: poll.status === 'ACTIVE' ? 'Active' : 'Closed',
            options: (poll.options || []).map((option: any) => ({
              id: `OPT-${option.id}`,
              text: option.optionText,
              votes: Number(option.voteCount) || 0
            }))
          })));
        } else {
          console.error('Unable to load resident polls:', res?.message);
        }
      },
      error: error => console.error('Unable to load resident polls:', error)
    });

    this.api.getNotifications(user.userId).subscribe({
      next: res => {
        if (res?.success) {
          this.notifications.set((res.data || []).map((notification: any) => ({
            id: `NOTIF-${notification.id}`,
            title: notification.title,
            message: notification.message || '',
            category: this.mapNotificationCategory(notification.category),
            timestamp: notification.createdAt || '',
            isRead: Boolean(notification.isRead),
            linkTab: notification.linkTab
          })));
        } else {
          console.error('Unable to load resident notifications:', res?.message);
        }
      },
      error: error => console.error('Unable to load resident notifications:', error)
    });

    this.api.getSupportTickets(societyId).subscribe({
      next: res => {
        if (res?.success) {
          this.feedbacks.set((res.data || [])
            .filter((ticket: any) => ticket.requesterId === user.userId)
            .map((ticket: any) => ({
              id: `FB-${ticket.id}`,
              category: this.mapFeedbackCategory(ticket.category),
              subject: ticket.subject,
              message: ticket.messages?.[0]?.messageText || '',
              rating: Number(/Rating: ([1-5])\/5/.exec(ticket.messages?.[0]?.messageText || '')?.[1]) || 0,
              submittedDate: ticket.createdAt || '',
              status: ticket.status === 'RESOLVED' ? 'Action Taken' : ticket.status === 'IN_PROGRESS' ? 'Acknowledged' : 'Under Review'
            })));
        } else {
          console.error('Unable to load resident feedback:', res?.message);
        }
      },
      error: error => console.error('Unable to load resident feedback:', error)
    });
  }

  // Actions:

  // Register Complaint
  addComplaint(data: {
    title: string;
    category: Complaint['category'];
    description: string;
    priority: Complaint['priority'];
  }): Observable<ApiResponse<any>> {
    const user = this.authService?.currentUser();
    if (!user?.residentId || !user.societyId || !user.flat) {
      return throwError(() => new Error('Your account is missing resident, society, or flat information.'));
    }
    return this.api.createComplaint({
      title: data.title,
      category: data.category.toUpperCase(),
      description: data.description,
      priority: data.priority.toUpperCase(),
      flatNumber: user.flat,
      residentId: user.residentId,
      residentName: user.name,
      societyId: user.societyId,
      status: 'OPEN'
    }).pipe(tap(() => this.syncFromBackend()));
  }

  // Pay Maintenance Bill
  payBill(billId: string, paymentMethod: PaymentRecord['paymentMethod']): Observable<PaymentRecord> {
    const bill = this.bills().find(b => b.id === billId);
    const numericBillId = this.parseId(billId, 'BILL');
    if (!bill || !Number.isInteger(numericBillId) || numericBillId < 1) {
      return throwError(() => new Error('The selected bill is not available.'));
    }
    const txnId = `TXN-${paymentMethod.toUpperCase().replace(/\s+/g, '')}-${Date.now().toString().slice(-8)}`;

    return this.api.payBill(numericBillId, paymentMethod.toUpperCase(), txnId).pipe(
      tap(response => {
        if (!response.success || !response.data || response.data.status !== 'SUCCESS') {
          throw new Error(response.message || 'Payment was not completed.');
        }
        this.syncFromBackend();
      }),
      map(response => {
        const payment = response.data;
        return {
          id: `PAY-${payment.id}`,
          receiptNumber: payment.receiptNumber || '',
          billId,
          billMonth: bill.month,
          amount: Number(payment.amount) || 0,
          paymentDate: payment.paymentDate || '',
          paymentMethod,
          transactionId: payment.transactionId || txnId,
          status: payment.status === 'SUCCESS' ? 'Success' : payment.status === 'FAILED' ? 'Failed' : 'Processing',
          receiptUrl: payment.receiptUrl || undefined
        };
      })
    );
  }

  // Facility Booking
  bookFacility(data: {
    facilityId: string;
    facilityName: FacilityBooking['facilityName'];
    date: string;
    timeSlot: string;
    guestsCount: number;
    specialRequests?: string;
  }): Observable<ApiResponse<any>> {
    const user = this.authService?.currentUser();
    const facilityId = Number(data.facilityId);
    const facility = this.facilities().find(item => Number(item.id) === facilityId);
    const [startTime, endTime] = data.timeSlot.split('-').map(time => this.parseTime(time.trim()));
    const startMinutes = startTime ? this.timeToMinutes(startTime) : NaN;
    const endMinutes = endTime ? this.timeToMinutes(endTime) : NaN;
    if (!user?.residentId || !user.societyId || !user.flat || !facility || facility.status !== 'AVAILABLE' ||
      !startTime || !endTime || endMinutes <= startMinutes || !data.date) {
      return throwError(() => new Error('Your account, selected facility, date, or booking time is invalid.'));
    }
    return this.api.createBooking({
      facilityId,
      facilityName: data.facilityName,
      societyId: user.societyId,
      residentId: user.residentId,
      residentName: user.name,
      flatNumber: user.flat,
      bookingDate: data.date,
      startTime,
      endTime,
      bookingFee: facility.pricePerHour * (endMinutes - startMinutes) / 60,
      guestsCount: data.guestsCount,
      specialRequests: data.specialRequests,
      status: 'PENDING_APPROVAL'
    }).pipe(tap(response => {
      if (!response.success) throw new Error(response.message || 'Booking could not be submitted.');
      this.syncFromBackend();
    }));
  }

  // Visitor Management
  registerVisitor(visitorData: {
    name: string;
    phone: string;
    purpose: Visitor['purpose'];
    date: string;
    time: string;
    vehicleNumber?: string;
  }): Observable<ApiResponse<any>> {
    const user = this.authService?.currentUser();
    if (!user?.residentId || !user.societyId || !user.flat ||
      !/^\d{4}-\d{2}-\d{2}$/.test(visitorData.date) || !/^\d{2}:\d{2}$/.test(visitorData.time)) {
      return throwError(() => new Error('Your account or expected visit date/time is missing or invalid.'));
    }
    return this.api.createVisitor({
      name: visitorData.name,
      phone: visitorData.phone,
      purpose: visitorData.purpose.toUpperCase().replace(/\s+/g, '_'),
      vehicleNumber: visitorData.vehicleNumber,
      flatNumber: user.flat,
      hostResidentId: user.residentId,
      hostResidentName: user.name,
      expectedVisitAt: `${visitorData.date}T${visitorData.time}:00`,
      status: 'EXPECTED'
    }).pipe(tap(response => {
      if (!response.success) throw new Error(response.message || 'Visitor registration could not be completed.');
      this.syncFromBackend();
    }));
  }

  approveVisitorEntry(visitorId: string): Observable<ApiResponse<any>> {
    return this.updateVisitorStatus(visitorId, 'APPROVED');
  }

  denyVisitorEntry(visitorId: string): Observable<ApiResponse<any>> {
    return this.updateVisitorStatus(visitorId, 'DENIED');
  }

  private updateVisitorStatus(visitorId: string, status: string): Observable<ApiResponse<any>> {
    const id = this.parseId(visitorId, 'VIS');
    if (!Number.isInteger(id) || id < 1) return throwError(() => new Error('The selected visitor record is invalid.'));
    return this.api.updateVisitorStatus(id, status).pipe(tap(response => {
      if (!response.success) throw new Error(response.message || 'Visitor status could not be updated.');
      this.syncFromBackend();
    }));
  }

  // Cast Poll Vote
  castVote(pollId: string, optionId: string): Observable<ApiResponse<any>> {
    const user = this.authService?.currentUser();
    const pollNumericId = this.parseId(pollId, 'POLL');
    const optionNumericId = this.parseId(optionId, 'OPT');
    if (!user?.userId || !Number.isInteger(pollNumericId) || !Number.isInteger(optionNumericId)) {
      return throwError(() => new Error('The selected poll option or resident account is invalid.'));
    }
    return this.api.votePoll(pollNumericId, optionNumericId, user.userId).pipe(tap(response => {
      if (!response.success) throw new Error(response.message || 'Your vote could not be recorded.');
      this.syncFromBackend();
    }));
  }

  // Submit Feedback
  submitFeedback(data: {
    category: FeedbackSubmission['category'];
    subject: string;
    message: string;
    rating: number;
  }): Observable<ApiResponse<any>> {
    const user = this.authService?.currentUser();
    if (!user?.userId || !user.societyId) {
      return throwError(() => new Error('Your account is missing resident or society information.'));
    }
    return this.api.createSupportTicket({
      requesterId: user.userId,
      subject: data.subject,
      category: data.category.toUpperCase().replace(/\s+/g, '_'),
      priority: 'NORMAL',
      societyId: user.societyId
    }).pipe(
      switchMap(response => {
        if (!response.success || !response.data?.id) {
          return throwError(() => new Error(response.message || 'Feedback could not be submitted.'));
        }
        return this.api.addSupportTicketMessage(Number(response.data.id), {
          senderId: user.userId,
          senderName: user.name,
          messageText: `${data.message}\n\nRating: ${data.rating}/5`,
          isStaff: false
        });
      }),
      tap(response => {
        if (!response.success) throw new Error(response.message || 'Feedback could not be submitted.');
        this.syncFromBackend();
      })
    );
  }

  markNotificationRead(id: string) {
    const notificationId = this.parseId(id, 'NOTIF');
    if (!Number.isInteger(notificationId) || notificationId < 1) return;
    this.api.markNotificationRead(notificationId).subscribe({
      next: response => {
        if (response.success) {
          this.notifications.update(list => list.map(n => n.id === id ? { ...n, isRead: true } : n));
        } else {
          console.error('Unable to mark notification as read:', response.message);
        }
      },
      error: error => console.error('Unable to mark notification as read:', error)
    });
  }

  markAllNotificationsRead(): Observable<ApiResponse<void>> {
    const user = this.authService?.currentUser();
    if (!user?.userId) return throwError(() => new Error('No logged-in resident was found.'));
    return this.api.markAllNotificationsRead(user.userId).pipe(tap(response => {
      if (!response.success) throw new Error(response.message || 'Notifications could not be marked as read.');
      this.notifications.update(list => list.map(n => ({ ...n, isRead: true })));
    }));
  }

  // Update profile
  updateProfileDetails(updated: {
    emergencyName?: string;
    emergencyPhone?: string;
    emergencyRelation?: string;
  }): void {
    console.warn('Emergency contact changes are not persisted because the backend has no profile update endpoint.');
  }
}
