import { Injectable, signal, computed } from '@angular/core';
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
  NotificationItem
} from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class ResidentService {
  // 1. Flat & Profile Info
  readonly flatInfo = signal<FlatInfo>({
    wing: 'Tower A - Palm Grove',
    flatNumber: 'A-204',
    floor: 2,
    bhkType: '3 BHK Luxury Apartment',
    carpetAreaSqFt: 1450,
    parkingSlot: 'B1-Slot-42 (Covered)',
    ownershipType: 'Owner',
    residentSince: 'Nov 2022',
    occupancyCount: 3,
    emergencyContact: {
      name: 'Vikas Sharma (Spouse)',
      relationship: 'Spouse',
      phone: '+91 98765 89012'
    },
    vehicles: [
      { type: 'Car', model: 'Honda City (White)', registrationNumber: 'MH 12 AB 4589', slot: 'B1-Slot-42' },
      { type: 'Two-Wheeler', model: 'Ather 450X (Grey)', registrationNumber: 'MH 12 XY 9921', slot: 'Two-Wheeler Bay 14' }
    ]
  });

  // 2. Complaints
  readonly complaints = signal<Complaint[]>([
    {
      id: 'CMP-2026-104',
      title: 'Water pressure low in master bedroom bathroom',
      category: 'Plumbing',
      description: 'The overhead shower in master bedroom is receiving very low water pressure since yesterday morning.',
      priority: 'Medium',
      status: 'In Progress',
      dateReported: '16 Oct 2026',
      flat: 'A-204',
      assignedStaff: {
        name: 'Suresh Kumar',
        phone: '+91 98220 11234',
        role: 'Senior Plumber'
      }
    },
    {
      id: 'CMP-2026-092',
      title: 'Balcony sliding door latch jammed',
      category: 'Carpentry',
      description: 'The lock latch on the living room balcony door is sticking and cannot be locked securely.',
      priority: 'Low',
      status: 'Assigned',
      dateReported: '14 Oct 2026',
      flat: 'A-204',
      assignedStaff: {
        name: 'Manoj Mistry',
        phone: '+91 98220 55667',
        role: 'Society Carpenter'
      }
    },
    {
      id: 'CMP-2026-081',
      title: 'Tower A Lift 2 jerk during stop on 2nd floor',
      category: 'Lift',
      description: 'Lift 2 produces a loud mechanical thud and jerks slightly when leveling at the 2nd floor.',
      priority: 'Urgent',
      status: 'Resolved',
      dateReported: '08 Oct 2026',
      flat: 'A-204',
      assignedStaff: {
        name: 'Schindler Express Team',
        phone: '1800-200-1199',
        role: 'OEM Technician'
      },
      resolutionNote: 'Hydraulic leveling buffer sensor recalibrated and tested.',
      resolvedDate: '10 Oct 2026'
    }
  ]);

  // 3. Maintenance Bills
  readonly bills = signal<MaintenanceBill[]>([
    {
      id: 'BILL-OCT-2026',
      billNumber: 'INV/2026-27/1089',
      month: 'October 2026',
      dueDate: '25 Oct 2026',
      issuedDate: '01 Oct 2026',
      baseAmount: 3850,
      sinkingFund: 650,
      waterCharges: 400,
      parkingCharges: 300,
      penalty: 0,
      totalAmount: 5200,
      status: 'Unpaid'
    },
    {
      id: 'BILL-SEP-2026',
      billNumber: 'INV/2026-27/0984',
      month: 'September 2026',
      dueDate: '25 Sep 2026',
      issuedDate: '01 Sep 2026',
      baseAmount: 3850,
      sinkingFund: 650,
      waterCharges: 400,
      parkingCharges: 300,
      penalty: 0,
      totalAmount: 5200,
      status: 'Paid',
      paidDate: '12 Sep 2026',
      paymentMode: 'UPI (Google Pay)',
      receiptNumber: 'RCP-2026-09-4421'
    },
    {
      id: 'BILL-AUG-2026',
      billNumber: 'INV/2026-27/0879',
      month: 'August 2026',
      dueDate: '25 Aug 2026',
      issuedDate: '01 Aug 2026',
      baseAmount: 3850,
      sinkingFund: 650,
      waterCharges: 400,
      parkingCharges: 300,
      penalty: 0,
      totalAmount: 5200,
      status: 'Paid',
      paidDate: '15 Aug 2026',
      paymentMode: 'Net Banking (HDFC)',
      receiptNumber: 'RCP-2026-08-3190'
    }
  ]);

  // 4. Payment Records
  readonly paymentHistory = signal<PaymentRecord[]>([
    {
      id: 'PAY-9011',
      receiptNumber: 'RCP-2026-09-4421',
      billId: 'BILL-SEP-2026',
      billMonth: 'September 2026',
      amount: 5200,
      paymentDate: '12 Sep 2026, 04:32 PM',
      paymentMethod: 'UPI',
      transactionId: 'TXN-UPI-982187319',
      status: 'Success'
    },
    {
      id: 'PAY-8104',
      receiptNumber: 'RCP-2026-08-3190',
      billId: 'BILL-AUG-2026',
      billMonth: 'August 2026',
      amount: 5200,
      paymentDate: '15 Aug 2026, 11:15 AM',
      paymentMethod: 'Net Banking',
      transactionId: 'TXN-HDFC-5519280',
      status: 'Success'
    },
    {
      id: 'PAY-7412',
      receiptNumber: 'RCP-2026-07-2081',
      billId: 'BILL-JUL-2026',
      billMonth: 'July 2026',
      amount: 5200,
      paymentDate: '10 Jul 2026, 02:40 PM',
      paymentMethod: 'Credit Card',
      transactionId: 'TXN-CC-77192834',
      status: 'Success'
    }
  ]);

  // 5. Facility Bookings
  readonly bookings = signal<FacilityBooking[]>([
    {
      id: 'BK-2026-042',
      facilityName: 'Clubhouse',
      date: '24 Oct 2026',
      timeSlot: '05:00 PM - 09:00 PM',
      guestsCount: 25,
      status: 'Confirmed',
      bookingFee: 1500,
      specialRequests: 'Birthday celebration setup with projector access',
      createdAt: '12 Oct 2026'
    },
    {
      id: 'BK-2026-031',
      facilityName: 'Tennis Court',
      date: '28 Oct 2026',
      timeSlot: '06:00 AM - 08:00 AM',
      guestsCount: 4,
      status: 'Confirmed',
      bookingFee: 0,
      createdAt: '15 Oct 2026'
    },
    {
      id: 'BK-2026-018',
      facilityName: 'Community Hall',
      date: '05 Sep 2026',
      timeSlot: '10:00 AM - 04:00 PM',
      guestsCount: 60,
      status: 'Completed',
      bookingFee: 3000,
      createdAt: '20 Aug 2026'
    }
  ]);

  // 6. Visitor Management
  readonly visitors = signal<Visitor[]>([
    {
      id: 'VIS-101',
      name: 'Sunil Verma',
      phone: '+91 98223 99881',
      purpose: 'Guest',
      date: '18 Oct 2026',
      time: '04:30 PM',
      vehicleNumber: 'MH 14 CC 7712',
      entryPassCode: 'PASS-8941',
      status: 'Expected',
      flat: 'A-204',
      registeredAt: 'Today'
    },
    {
      id: 'VIS-102',
      name: 'Amazon Prime Delivery (Rahul)',
      phone: '+91 97665 11029',
      purpose: 'Delivery',
      date: '17 Oct 2026',
      time: '02:15 PM',
      entryPassCode: 'PASS-3312',
      status: 'Approved',
      flat: 'A-204',
      registeredAt: '17 Oct 2026'
    },
    {
      id: 'VIS-103',
      name: 'Urban Company Ac Technician',
      phone: '+91 98550 44321',
      purpose: 'Service Provider',
      date: '15 Oct 2026',
      time: '11:00 AM',
      entryPassCode: 'PASS-5590',
      status: 'Checked Out',
      flat: 'A-204',
      registeredAt: '15 Oct 2026'
    }
  ]);

  // 7. Notice Board
  readonly notices = signal<Notice[]>([
    {
      id: 'NTC-2026-24',
      title: 'Scheduled Water Supply Pipeline Maintenance',
      category: 'Maintenance',
      date: '18 Oct 2026',
      content: 'Water supply to Tower A and Tower B will experience low pressure between 10:00 AM and 01:00 PM due to preventive valve servicing on the terrace booster pumps.',
      priority: 'High',
      issuedBy: 'Estate Management Committee'
    },
    {
      id: 'NTC-2026-23',
      title: 'Diwali Grand Celebration & Cultural Night in Central Garden',
      category: 'Celebration',
      date: '28 Oct 2026',
      content: 'All residents are cordially invited for the Grand Diwali Gathering featuring cultural dances, delicious food stalls, and eco-friendly diya illumination starting at 6:30 PM.',
      priority: 'Normal',
      issuedBy: 'Cultural Committee'
    },
    {
      id: 'NTC-2026-22',
      title: 'Basement Parking Slot Deep Cleaning Drive',
      category: 'Rules',
      date: '22 Oct 2026',
      content: 'Basement level B1 and B2 will undergo mechanized pressure washing. Residents are requested to park in designated temporary open bays during their respective floor slots.',
      priority: 'Normal',
      issuedBy: 'Society Secretary Office'
    },
    {
      id: 'NTC-2026-21',
      title: 'Annual General Meeting (AGM) 2026 Announcement & Agenda',
      category: 'General',
      date: '12 Oct 2026',
      content: 'The Annual General Body meeting is scheduled for 8th November 2026 at the Society Clubhouse at 10:30 AM. Audited financials are attached in the Documents section.',
      priority: 'High',
      issuedBy: 'Secretary - Rajesh Mehta'
    }
  ]);

  // 8. Documents & Bylaws
  readonly documents = signal<SocietyDocument[]>([
    {
      id: 'DOC-01',
      title: 'Greenwood Heights Society Bylaws & Community Rules (2026 Ed.)',
      category: 'Bylaws & Rules',
      fileSize: '3.4 MB',
      fileType: 'PDF',
      uploadedDate: 'Jan 2026',
      description: 'Comprehensive guidelines on renovation hours, pet policies, clubhouse usage, and quiet hours.'
    },
    {
      id: 'DOC-02',
      title: 'Audited Financial Statement & Balance Sheet FY 2025-26',
      category: 'Financial & Audit',
      fileSize: '5.1 MB',
      fileType: 'PDF',
      uploadedDate: 'Sep 2026',
      description: 'Chartered accountant statutory audit report and sinking fund health statement.'
    },
    {
      id: 'DOC-03',
      title: 'Standard Flat Renovation & Interior Work NOC Form',
      category: 'NOC Forms',
      fileSize: '450 KB',
      fileType: 'PDF',
      uploadedDate: 'Mar 2026',
      description: 'Form required prior to carrying out civil, electrical, or carpentry modifications.'
    },
    {
      id: 'DOC-04',
      title: 'Emergency Evacuation & Fire Safety Protocol Map',
      category: 'Guidelines',
      fileSize: '1.8 MB',
      fileType: 'PDF',
      uploadedDate: 'Feb 2026',
      description: 'Detailed assembly area locations, hose reel points, and stairwell safety instructions.'
    }
  ]);

  // 9. Polls & Surveys
  readonly polls = signal<Poll[]>([
    {
      id: 'POLL-2026-01',
      title: 'Proposal for Dedicated EV Charging Stations in Basement B1',
      description: 'Should the society partner with an EV provider to install 8 fast-charging points funded via consumption-metered tariffs?',
      category: 'Infrastructure',
      endDate: '26 Oct 2026',
      totalVotes: 142,
      userVotedOptionId: 'OPT-1',
      status: 'Active',
      options: [
        { id: 'OPT-1', text: 'Yes, fully approve installation', votes: 114 },
        { id: 'OPT-2', text: 'Need more technical & cost details', votes: 21 },
        { id: 'OPT-3', text: 'No, against the proposal', votes: 7 }
      ]
    },
    {
      id: 'POLL-2026-02',
      title: 'Swimming Pool Winter Timings Adjustment',
      description: 'Select your preferred morning opening slot for the heated pool during November-January.',
      category: 'Amenities',
      endDate: '30 Oct 2026',
      totalVotes: 89,
      status: 'Active',
      options: [
        { id: 'OPT-A', text: '06:30 AM - 10:30 AM', votes: 42 },
        { id: 'OPT-B', text: '07:00 AM - 11:00 AM', votes: 36 },
        { id: 'OPT-C', text: 'Keep current 06:00 AM - 09:30 AM', votes: 11 }
      ]
    }
  ]);

  // 10. Feedbacks
  readonly feedbacks = signal<FeedbackSubmission[]>([
    {
      id: 'FB-01',
      category: 'Cleanliness',
      subject: 'Great upkeep of central garden blooming flowers',
      message: 'Appreciating the gardening staff for the beautiful seasonal flower beds along the walking track.',
      rating: 5,
      submittedDate: '10 Oct 2026',
      status: 'Acknowledged'
    }
  ]);

  // 11. Notifications
  readonly notifications = signal<NotificationItem[]>([
    {
      id: 'NOTIF-1',
      title: 'Maintenance Bill Generated',
      message: 'Your maintenance dues for October 2026 (₹5,200) are due by 25 Oct 2026.',
      category: 'Bill',
      timestamp: 'Today, 09:00 AM',
      isRead: false,
      linkTab: 'bills'
    },
    {
      id: 'NOTIF-2',
      title: 'Technician Assigned',
      message: 'Plumber Suresh Kumar has been assigned to your complaint CMP-2026-104.',
      category: 'Complaint',
      timestamp: 'Yesterday, 04:30 PM',
      isRead: false,
      linkTab: 'complaints'
    },
    {
      id: 'NOTIF-3',
      title: 'Facility Booking Confirmed',
      message: 'Your Clubhouse booking for 24 Oct (05:00 PM - 09:00 PM) has been confirmed.',
      category: 'Facility',
      timestamp: '12 Oct 2026',
      isRead: true,
      linkTab: 'facilities'
    },
    {
      id: 'NOTIF-4',
      title: 'New Society Notice',
      message: 'Notice regarding Water Supply Pipeline Maintenance has been posted.',
      category: 'Notice',
      timestamp: '11 Oct 2026',
      isRead: true,
      linkTab: 'notices'
    }
  ]);

  // Computed summary metrics for Dashboard
  readonly unpaidBillCount = computed(() => this.bills().filter(b => b.status === 'Unpaid').length);
  readonly totalDueAmount = computed(() =>
    this.bills()
      .filter(b => b.status === 'Unpaid')
      .reduce((sum, b) => sum + b.totalAmount, 0)
  );
  readonly activeComplaintCount = computed(() =>
    this.complaints().filter(c => c.status !== 'Resolved' && c.status !== 'Closed').length
  );
  readonly upcomingBookingCount = computed(() =>
    this.bookings().filter(b => b.status === 'Confirmed').length
  );
  readonly unreadNotificationCount = computed(() =>
    this.notifications().filter(n => !n.isRead).length
  );

  // Actions:

  // Register Complaint
  addComplaint(data: {
    title: string;
    category: Complaint['category'];
    description: string;
    priority: Complaint['priority'];
  }) {
    const newId = `CMP-2026-${Math.floor(100 + Math.random() * 900)}`;
    const newComplaint: Complaint = {
      id: newId,
      title: data.title,
      category: data.category,
      description: data.description,
      priority: data.priority,
      status: 'Reported',
      dateReported: 'Just now',
      flat: this.flatInfo().flatNumber
    };

    this.complaints.update(list => [newComplaint, ...list]);
    this.addNotification({
      title: 'Complaint Registered',
      message: `Your complaint ${newId} has been logged and assigned for review.`,
      category: 'Complaint',
      linkTab: 'complaints'
    });
  }

  // Pay Maintenance Bill
  payBill(billId: string, paymentMethod: PaymentRecord['paymentMethod']): PaymentRecord {
    const bill = this.bills().find(b => b.id === billId);
    if (!bill) throw new Error('Bill not found');

    const receiptNo = `RCP-2026-10-${Math.floor(1000 + Math.random() * 9000)}`;
    const txnId = `TXN-${paymentMethod.toUpperCase().replace(/\s+/g, '')}-${Date.now().toString().slice(-8)}`;

    const newRecord: PaymentRecord = {
      id: `PAY-${Math.floor(1000 + Math.random() * 9000)}`,
      receiptNumber: receiptNo,
      billId: bill.id,
      billMonth: bill.month,
      amount: bill.totalAmount,
      paymentDate: 'Today, Just now',
      paymentMethod: paymentMethod,
      transactionId: txnId,
      status: 'Success'
    };

    // Update bill status to paid
    this.bills.update(list =>
      list.map(b =>
        b.id === billId
          ? {
              ...b,
              status: 'Paid',
              paidDate: 'Today',
              paymentMode: paymentMethod,
              receiptNumber: receiptNo
            }
          : b
      )
    );

    // Add to payment history
    this.paymentHistory.update(list => [newRecord, ...list]);

    // Send notification
    this.addNotification({
      title: 'Maintenance Payment Successful',
      message: `Payment of ₹${bill.totalAmount} for ${bill.month} received. Receipt #${receiptNo} generated.`,
      category: 'Bill',
      linkTab: 'bills'
    });

    return newRecord;
  }

  // Facility Booking
  bookFacility(data: {
    facilityName: FacilityBooking['facilityName'];
    date: string;
    timeSlot: string;
    guestsCount: number;
    bookingFee: number;
    specialRequests?: string;
  }) {
    const newBooking: FacilityBooking = {
      id: `BK-2026-${Math.floor(100 + Math.random() * 900)}`,
      facilityName: data.facilityName,
      date: data.date,
      timeSlot: data.timeSlot,
      guestsCount: data.guestsCount,
      bookingFee: data.bookingFee,
      specialRequests: data.specialRequests,
      status: 'Confirmed',
      createdAt: 'Just now'
    };

    this.bookings.update(list => [newBooking, ...list]);
    this.addNotification({
      title: 'Facility Booked',
      message: `Your reservation for ${data.facilityName} on ${data.date} is confirmed!`,
      category: 'Facility',
      linkTab: 'facilities'
    });
  }

  // Visitor Management
  registerVisitor(visitorData: {
    name: string;
    phone: string;
    purpose: Visitor['purpose'];
    date: string;
    time: string;
    vehicleNumber?: string;
  }) {
    const passCode = `PASS-${Math.floor(1000 + Math.random() * 9000)}`;
    const newVisitor: Visitor = {
      id: `VIS-${Math.floor(100 + Math.random() * 900)}`,
      name: visitorData.name,
      phone: visitorData.phone,
      purpose: visitorData.purpose,
      date: visitorData.date,
      time: visitorData.time,
      vehicleNumber: visitorData.vehicleNumber,
      entryPassCode: passCode,
      status: 'Expected',
      flat: this.flatInfo().flatNumber,
      registeredAt: 'Just now'
    };

    this.visitors.update(list => [newVisitor, ...list]);
    this.addNotification({
      title: 'Visitor Pre-Approved',
      message: `${visitorData.name} pre-approved with Entry Pass ${passCode}.`,
      category: 'Visitor',
      linkTab: 'visitors'
    });
  }

  approveVisitorEntry(visitorId: string) {
    this.visitors.update(list =>
      list.map(v => (v.id === visitorId ? { ...v, status: 'Approved' } : v))
    );
  }

  denyVisitorEntry(visitorId: string) {
    this.visitors.update(list =>
      list.map(v => (v.id === visitorId ? { ...v, status: 'Denied' } : v))
    );
  }

  // Cast Poll Vote
  castVote(pollId: string, optionId: string) {
    this.polls.update(list =>
      list.map(poll => {
        if (poll.id !== pollId) return poll;
        const currentVote = poll.userVotedOptionId;
        return {
          ...poll,
          userVotedOptionId: optionId,
          totalVotes: currentVote ? poll.totalVotes : poll.totalVotes + 1,
          options: poll.options.map(opt => {
            if (opt.id === optionId) {
              return { ...opt, votes: opt.votes + 1 };
            }
            if (currentVote && opt.id === currentVote) {
              return { ...opt, votes: Math.max(0, opt.votes - 1) };
            }
            return opt;
          })
        };
      })
    );
  }

  // Submit Feedback
  submitFeedback(data: {
    category: FeedbackSubmission['category'];
    subject: string;
    message: string;
    rating: number;
  }) {
    const newFeedback: FeedbackSubmission = {
      id: `FB-${Math.floor(10 + Math.random() * 90)}`,
      category: data.category,
      subject: data.subject,
      message: data.message,
      rating: data.rating,
      submittedDate: 'Today',
      status: 'Under Review'
    };

    this.feedbacks.update(list => [newFeedback, ...list]);
    this.addNotification({
      title: 'Feedback Received',
      message: 'Thank you for your feedback! The society management has been notified.',
      category: 'Notice',
      linkTab: 'feedback'
    });
  }

  // Notifications
  addNotification(item: Omit<NotificationItem, 'id' | 'timestamp' | 'isRead'>) {
    const newNotif: NotificationItem = {
      ...item,
      id: `NOTIF-${Date.now()}`,
      timestamp: 'Just now',
      isRead: false
    };
    this.notifications.update(list => [newNotif, ...list]);
  }

  markNotificationRead(id: string) {
    this.notifications.update(list =>
      list.map(n => (n.id === id ? { ...n, isRead: true } : n))
    );
  }

  markAllNotificationsRead() {
    this.notifications.update(list => list.map(n => ({ ...n, isRead: true })));
  }

  // Update profile
  updateProfileDetails(updated: {
    emergencyName?: string;
    emergencyPhone?: string;
    emergencyRelation?: string;
  }) {
    this.flatInfo.update(current => ({
      ...current,
      emergencyContact: {
        name: updated.emergencyName || current.emergencyContact.name,
        phone: updated.emergencyPhone || current.emergencyContact.phone,
        relationship: updated.emergencyRelation || current.emergencyContact.relationship
      }
    }));
  }
}
