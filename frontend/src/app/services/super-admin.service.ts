import { Injectable, signal, inject } from '@angular/core';
import { ApiService } from './api.service';
import { AuthService } from './auth.service';

export interface SocietyRecord {
  id: string;
  name: string;
  regNumber: string;
  location: string;
  units: number;
  towers: number;
  adminName: string;
  adminEmail: string;
  status: 'Active' | 'Pending Verification' | 'Suspended';
  subscriptionPlan: 'Enterprise' | 'Professional' | 'Standard';
  onboardedDate: string;
  monthlyDuesVolume: string;
}

export interface VerificationRequest {
  id: string;
  societyName: string;
  secretaryName: string;
  secretaryEmail: string;
  phone: string;
  regNumber: string;
  city: string;
  units: number;
  submissionDate: string;
  documents: { name: string; size: string; type: string }[];
  status: 'Under Review' | 'Verified' | 'Requires Clarification' | 'Rejected';
  notes?: string;
}

export interface SocietyAdminAccount {
  id: string;
  societyId: string;
  societyName: string;
  adminName: string;
  email: string;
  phone: string;
  designation: 'Society Secretary' | 'Chairman' | 'Treasurer' | 'Managing Committee';
  status: 'Authorized' | 'Pending Authorization' | 'Revoked';
  authorizedDate: string;
  lastLogin: string;
}

export interface PlatformUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  societyName: string;
  role: 'Resident' | 'Secretary Admin' | 'Maintenance Staff';
  flat?: string;
  trade?: string;
  status: 'Active' | 'Suspended' | 'Locked 2FA';
  registeredDate: string;
}

export interface SupportTicket {
  id: string;
  societyName: string;
  secretaryName: string;
  secretaryEmail: string;
  subject: string;
  category: 'Billing & Gateway' | 'Gate Hardware / RFID' | 'Data Migration' | 'Account Access';
  priority: 'Urgent' | 'Medium' | 'Normal';
  status: 'Open' | 'In Progress' | 'Resolved';
  createdAt: string;
  messages: { sender: string; text: string; time: string; isStaff: boolean }[];
}

export interface AuditLogItem {
  id: string;
  timestamp: string;
  actor: string;
  actorRole: string;
  ipAddress: string;
  action: string;
  target: string;
  severity: 'Info' | 'Warning' | 'Critical';
}

@Injectable({
  providedIn: 'root'
})
export class SuperAdminService {
  private api = inject(ApiService);
  private authService = inject(AuthService, { optional: true });

  constructor() {
    this.syncFromBackend();
    this.authService?.authStateChanged$.subscribe(() => {
      this.syncFromBackend();
    });
  }

  syncFromBackend(): void {
    // 1. Societies
    this.api.getSocieties().subscribe({
      next: (res) => {
        if (res?.success && res.data?.length) {
          const mapped: SocietyRecord[] = res.data.map(s => ({
            id: s.code || ('SOC-' + s.id),
            name: s.name,
            regNumber: s.registrationNumber || 'REG-' + s.id,
            location: s.location || (s.city ? s.city + ', MH' : 'Baner, Pune, MH'),
            units: s.totalUnits || 100,
            towers: s.totalTowers || 3,
            adminName: s.adminName || 'Admin',
            adminEmail: s.adminEmail || 'admin@society.com',
            status: (s.status === 'ACTIVE' ? 'Active' : s.status === 'PENDING' ? 'Pending Verification' : 'Suspended') as any,
            subscriptionPlan: (s.subscriptionPlan || 'Enterprise') as any,
            onboardedDate: s.onboardedDate || '12 Jan 2024',
            monthlyDuesVolume: s.monthlyDuesVolume || '₹5,00,000'
          }));
          this.societies.set(mapped);
        }
      },
      error: () => {}
    });

    // 2. Verifications
    this.api.getVerifications().subscribe({
      next: (res) => {
        if (res?.success && res.data?.length) {
          const mapped: VerificationRequest[] = res.data.map(v => ({
            id: 'VER-' + v.id,
            societyName: v.societyName,
            secretaryName: v.secretaryName,
            secretaryEmail: v.secretaryEmail,
            phone: v.phone || '+91 98220 99401',
            regNumber: v.registrationNumber || 'MAH/PUN/2024/7701',
            city: v.city || 'Pune',
            units: v.totalUnits || 120,
            submissionDate: v.createdAt ? new Date(v.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : 'Today',
            documents: [
              { name: 'Society_Registration_Certificate.pdf', size: '2.4 MB', type: 'Certificate' },
              { name: 'Model_Bylaws_Adoption_Signed.pdf', size: '4.1 MB', type: 'Legal Bylaws' }
            ],
            status: (v.status === 'VERIFIED' ? 'Verified' : v.status === 'REQUIRES_CLARIFICATION' ? 'Requires Clarification' : v.status === 'REJECTED' ? 'Rejected' : 'Under Review') as any,
            notes: v.notes
          }));
          this.verifications.set(mapped);
        }
      },
      error: () => {}
    });

    // 3. Platform Users / Residents
    this.api.getResidents().subscribe({
      next: (res) => {
        if (res?.success && res.data?.length) {
          const mapped: PlatformUser[] = res.data.map(u => ({
            id: 'USR-' + u.id,
            name: u.name,
            email: u.email || '',
            phone: u.phone || '',
            societyName: 'Greenwood Heights',
            role: 'Resident',
            flat: u.flatNumber || 'A-101',
            status: (u.status === 'ACTIVE' ? 'Active' : 'Locked 2FA') as any,
            registeredDate: u.joinDate || 'Today'
          }));
          this.platformUsers.set(mapped);
        }
      },
      error: () => {}
    });

    // 4. Support Tickets
    this.api.getSupportTickets().subscribe({
      next: (res) => {
        if (res?.success && res.data?.length) {
          const mapped: SupportTicket[] = res.data.map(t => ({
            id: 'SUP-' + t.id,
            societyName: t.societyName || 'Greenwood Heights Co-op Society',
            secretaryName: t.createdByName || 'Secretary',
            secretaryEmail: t.createdByEmail || 'secretary@greenwood.com',
            subject: t.subject,
            category: (t.category || 'Billing & Gateway') as any,
            priority: (t.priority === 'HIGH' ? 'Urgent' : t.priority === 'LOW' ? 'Normal' : 'Medium') as any,
            status: (t.status === 'IN_PROGRESS' ? 'In Progress' : t.status === 'RESOLVED' ? 'Resolved' : 'Open') as any,
            createdAt: t.createdAt ? new Date(t.createdAt).toLocaleString('en-IN') : 'Today',
            messages: (t.messages || []).map((m: any) => ({
              sender: m.senderName || 'Desk',
              text: m.message,
              time: m.createdAt ? new Date(m.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) : 'Now',
              isStaff: m.isStaff || false
            }))
          }));
          this.supportTickets.set(mapped);
        }
      },
      error: () => {}
    });
  }
  // 1. Societies State
  readonly societies = signal<SocietyRecord[]>([
    {
      id: 'SOC-1041',
      name: 'Greenwood Heights Co-op Society',
      regNumber: 'MAH/PUN/2021/8941',
      location: 'Baner, Pune, MH',
      units: 120,
      towers: 3,
      adminName: 'Rajesh Mehta',
      adminEmail: 'secretary@greenwood.com',
      status: 'Active',
      subscriptionPlan: 'Enterprise',
      onboardedDate: '12 Jan 2024',
      monthlyDuesVolume: '₹6,24,000'
    },
    {
      id: 'SOC-1088',
      name: 'Palm Meadows Residential Township',
      regNumber: 'MAH/PUN/2022/4102',
      location: 'Kalyani Nagar, Pune, MH',
      units: 340,
      towers: 6,
      adminName: 'Sunil Deshmukh',
      adminEmail: 'sunil.deshmukh@palmmeadows.org',
      status: 'Active',
      subscriptionPlan: 'Enterprise',
      onboardedDate: '04 Mar 2024',
      monthlyDuesVolume: '₹18,40,000'
    },
    {
      id: 'SOC-1105',
      name: 'Silver Oak Luxury Residency',
      regNumber: 'MAH/MUM/2023/1109',
      location: 'Powai, Mumbai, MH',
      units: 84,
      towers: 2,
      adminName: 'Vikram Merchant',
      adminEmail: 'admin@silveroakpowai.com',
      status: 'Active',
      subscriptionPlan: 'Professional',
      onboardedDate: '19 Aug 2024',
      monthlyDuesVolume: '₹5,12,000'
    },
    {
      id: 'SOC-1142',
      name: 'Emerald Park Enclave',
      regNumber: 'MAH/PUN/2024/7701',
      location: 'Wakad, Pune, MH',
      units: 180,
      towers: 4,
      adminName: 'Nitin Gore',
      adminEmail: 'nitin.gore@emeraldpark.org',
      status: 'Pending Verification',
      subscriptionPlan: 'Standard',
      onboardedDate: '15 Oct 2026',
      monthlyDuesVolume: '₹0 (Pending)'
    },
    {
      id: 'SOC-1019',
      name: 'Royal Heritage Apartments',
      regNumber: 'MAH/PUN/2019/3321',
      location: 'Aundh, Pune, MH',
      units: 64,
      towers: 1,
      adminName: 'Sanjay Shinde',
      adminEmail: 'sanjay.shinde@royalheritage.in',
      status: 'Suspended',
      subscriptionPlan: 'Standard',
      onboardedDate: '10 Feb 2023',
      monthlyDuesVolume: '₹1,90,000'
    }
  ]);

  // 2. Society Verifications State
  readonly verifications = signal<VerificationRequest[]>([
    {
      id: 'VER-901',
      societyName: 'Emerald Park Enclave',
      secretaryName: 'Nitin Gore',
      secretaryEmail: 'nitin.gore@emeraldpark.org',
      phone: '+91 98220 99401',
      regNumber: 'MAH/PUN/2024/7701',
      city: 'Wakad, Pune',
      units: 180,
      submissionDate: '15 Oct 2026',
      documents: [
        { name: 'Society_Registration_Certificate.pdf', size: '2.4 MB', type: 'Certificate' },
        { name: 'Model_Bylaws_Adoption_Signed.pdf', size: '4.1 MB', type: 'Legal Bylaws' },
        { name: 'Electricity_Board_Substation_NOC.pdf', size: '1.2 MB', type: 'Utility NOC' }
      ],
      status: 'Under Review',
      notes: 'Registration certificate verified with Pune registrar records. Verifying bank mandate.'
    },
    {
      id: 'VER-902',
      societyName: 'Godrej Horizon Tower C & D',
      secretaryName: 'Meenakshi Iyer',
      secretaryEmail: 'meenakshi.iyer@horizon-society.com',
      phone: '+91 98111 44552',
      regNumber: 'MAH/MUM/RERA/P5180002194',
      city: 'Wadala, Mumbai',
      units: 240,
      submissionDate: '17 Oct 2026',
      documents: [
        { name: 'RERA_Possession_Certificate.pdf', size: '3.6 MB', type: 'RERA Document' },
        { name: 'Society_Formation_Resolution.pdf', size: '1.8 MB', type: 'AGM Resolution' }
      ],
      status: 'Under Review'
    },
    {
      id: 'VER-899',
      societyName: 'Skyline Orchid Gated Layout',
      secretaryName: 'Prashant Joshi',
      secretaryEmail: 'prashant@skylineorchid.in',
      phone: '+91 98900 11223',
      regNumber: 'MAH/PUN/2024/6502',
      city: 'Hinjawadi, Pune',
      units: 96,
      submissionDate: '12 Oct 2026',
      documents: [
        { name: 'Society_Deed_Draft.pdf', size: '1.5 MB', type: 'Deed of Declaration' }
      ],
      status: 'Requires Clarification',
      notes: 'Clarification requested: Bank account resolution certificate missing.'
    }
  ]);

  // 3. Society Admin Accounts State
  readonly societyAdmins = signal<SocietyAdminAccount[]>([
    {
      id: 'ADM-201',
      societyId: 'SOC-1041',
      societyName: 'Greenwood Heights Co-op Society',
      adminName: 'Rajesh Mehta',
      email: 'secretary@greenwood.com',
      phone: '+91 98765 88990',
      designation: 'Society Secretary',
      status: 'Authorized',
      authorizedDate: '12 Jan 2024',
      lastLogin: 'Today, 08:30 AM'
    },
    {
      id: 'ADM-202',
      societyId: 'SOC-1088',
      societyName: 'Palm Meadows Residential Township',
      adminName: 'Sunil Deshmukh',
      email: 'sunil.deshmukh@palmmeadows.org',
      phone: '+91 98765 44102',
      designation: 'Chairman',
      status: 'Authorized',
      authorizedDate: '04 Mar 2024',
      lastLogin: 'Yesterday, 06:14 PM'
    },
    {
      id: 'ADM-203',
      societyId: 'SOC-1105',
      societyName: 'Silver Oak Luxury Residency',
      adminName: 'Vikram Merchant',
      email: 'admin@silveroakpowai.com',
      phone: '+91 98200 77119',
      designation: 'Society Secretary',
      status: 'Authorized',
      authorizedDate: '19 Aug 2024',
      lastLogin: '16 Oct 2026'
    },
    {
      id: 'ADM-204',
      societyId: 'SOC-1142',
      societyName: 'Emerald Park Enclave',
      adminName: 'Nitin Gore',
      email: 'nitin.gore@emeraldpark.org',
      phone: '+91 98220 99401',
      designation: 'Society Secretary',
      status: 'Pending Authorization',
      authorizedDate: 'Pending Verification',
      lastLogin: 'Never'
    }
  ]);

  // 4. Global Platform Users State
  readonly platformUsers = signal<PlatformUser[]>([
    {
      id: 'USR-8901',
      name: 'Priya Sharma',
      email: 'priya.sharma@greenwood.com',
      phone: '+91 98765 43210',
      societyName: 'Greenwood Heights',
      role: 'Resident',
      flat: 'A-204',
      status: 'Active',
      registeredDate: '15 Jan 2024'
    },
    {
      id: 'USR-8902',
      name: 'Rahul Patil',
      email: 'rahul.patil@greenwood.com',
      phone: '+91 98765 12340',
      societyName: 'Greenwood Heights',
      role: 'Resident',
      flat: 'B-105',
      status: 'Active',
      registeredDate: '22 Feb 2024'
    },
    {
      id: 'USR-8903',
      name: 'Ramesh Shinde',
      email: 'maintenance.lead@greenwood.com',
      phone: '+91 98765 77112',
      societyName: 'Greenwood Heights',
      role: 'Maintenance Staff',
      trade: 'Lead Electrician',
      status: 'Active',
      registeredDate: '10 Feb 2024'
    },
    {
      id: 'USR-8904',
      name: 'Kavita Chawla',
      email: 'kavita.c@palmmeadows.org',
      phone: '+91 98220 11994',
      societyName: 'Palm Meadows Township',
      role: 'Resident',
      flat: 'T3-802',
      status: 'Locked 2FA',
      registeredDate: '11 Jun 2024'
    },
    {
      id: 'USR-8905',
      name: 'Vijay Kadam',
      email: 'vijay.kadam@vendor-service.com',
      phone: '+91 98660 33441',
      societyName: 'Silver Oak Residency',
      role: 'Maintenance Staff',
      trade: 'Elevator Specialist',
      status: 'Active',
      registeredDate: '01 Sep 2024'
    }
  ]);

  // 5. Support Tickets State
  readonly supportTickets = signal<SupportTicket[]>([
    {
      id: 'SUP-1402',
      societyName: 'Greenwood Heights Co-op Society',
      secretaryName: 'Rajesh Mehta',
      secretaryEmail: 'secretary@greenwood.com',
      subject: 'ICICI Bank Gateway Webhook Timeout for Dues Reconciliation',
      category: 'Billing & Gateway',
      priority: 'Urgent',
      status: 'Open',
      createdAt: 'Today, 09:15 AM',
      messages: [
        {
          sender: 'Rajesh Mehta (Secretary)',
          text: 'Several residents paid October maintenance through ICICI net banking. The payments show deducted in their bank accounts, but SocietySync webhook logged a 504 Gateway Timeout.',
          time: '09:15 AM',
          isStaff: false
        }
      ]
    },
    {
      id: 'SUP-1398',
      societyName: 'Palm Meadows Residential Township',
      secretaryName: 'Sunil Deshmukh',
      secretaryEmail: 'sunil.deshmukh@palmmeadows.org',
      subject: 'Bulk RFID Tag Import for Tower 4 & 5 Basement Parking',
      category: 'Gate Hardware / RFID',
      priority: 'Medium',
      status: 'In Progress',
      createdAt: 'Yesterday, 04:30 PM',
      messages: [
        {
          sender: 'Sunil Deshmukh (Chairman)',
          text: 'We have 250 new vehicle RFID fast-tags from our hardware vendor. Need assistance batch-mapping them to flat owner profiles.',
          time: 'Yesterday 04:30 PM',
          isStaff: false
        },
        {
          sender: 'Super Admin Desk',
          text: 'Template CSV has been sent to your email. You can upload the populated sheet directly under Gate Management -> RFID Batch Import.',
          time: 'Yesterday 06:10 PM',
          isStaff: true
        }
      ]
    },
    {
      id: 'SUP-1385',
      societyName: 'Silver Oak Luxury Residency',
      secretaryName: 'Vikram Merchant',
      secretaryEmail: 'admin@silveroakpowai.com',
      subject: 'Annual Maintenance Contract Renewal Notification Settings',
      category: 'Account Access',
      priority: 'Normal',
      status: 'Resolved',
      createdAt: '15 Oct 2026',
      messages: [
        {
          sender: 'Vikram Merchant',
          text: 'How can we configure automatic 30-day advance alerts for elevator and diesel generator AMC expiry?',
          time: '15 Oct 11:20 AM',
          isStaff: false
        },
        {
          sender: 'Super Admin Desk',
          text: 'Enabled Automated AMC Threshold Alerts under Society Settings -> Vendor Compliance. Alerts will now ping your committee dashboard.',
          time: '15 Oct 02:40 PM',
          isStaff: true
        }
      ]
    }
  ]);

  // 6. Platform Audit Logs State
  readonly auditLogs = signal<AuditLogItem[]>([
    {
      id: 'LOG-9401',
      timestamp: '18 Oct 2026, 01:24:12 IST',
      actor: 'Super Admin (Dhanashree Kadawale)',
      actorRole: 'Platform Super Admin',
      ipAddress: '103.21.144.12 (VPN)',
      action: 'Authorized Society Instance',
      target: 'SOC-1088 (Palm Meadows)',
      severity: 'Info'
    },
    {
      id: 'LOG-9400',
      timestamp: '18 Oct 2026, 00:52:45 IST',
      actor: 'System Security Daemon',
      actorRole: 'Automated Bot',
      ipAddress: '127.0.0.1 (Internal)',
      action: '256-Bit SSL Certificate Renewal',
      target: 'api.societysync.com',
      severity: 'Info'
    },
    {
      id: 'LOG-9399',
      timestamp: '17 Oct 2026, 22:15:30 IST',
      actor: 'Super Admin (Dhanashree Kadawale)',
      actorRole: 'Platform Super Admin',
      ipAddress: '103.21.144.12 (VPN)',
      action: 'Temporary Account Freeze (Fraud Investigation)',
      target: 'USR-8904 (Kavita Chawla)',
      severity: 'Warning'
    },
    {
      id: 'LOG-9398',
      timestamp: '17 Oct 2026, 18:40:11 IST',
      actor: 'Super Admin (Dhanashree Kadawale)',
      actorRole: 'Platform Super Admin',
      ipAddress: '103.21.144.12 (VPN)',
      action: 'Suspended Inactive Society Instance',
      target: 'SOC-1019 (Royal Heritage)',
      severity: 'Critical'
    },
    {
      id: 'LOG-9397',
      timestamp: '17 Oct 2026, 14:10:05 IST',
      actor: 'Secretary Rajesh Mehta',
      actorRole: 'Society Admin (Greenwood)',
      ipAddress: '49.36.12.88',
      action: 'Updated Society Maintenance Rate (₹3.50/sq.ft)',
      target: 'Greenwood Heights Billing Ledger',
      severity: 'Info'
    }
  ]);

  // Actions: Society Management
  updateSocietyStatus(id: string, status: 'Active' | 'Pending Verification' | 'Suspended'): void {
    const numericId = parseInt(id.replace(/\D/g, ''), 10);
    if (numericId) {
      this.api.updateSociety(numericId, {
        status: status === 'Active' ? 'ACTIVE' : status === 'Suspended' ? 'INACTIVE' : 'PENDING'
      }).subscribe({ error: () => {} });
    }
    this.societies.update(list =>
      list.map(s => (s.id === id ? { ...s, status } : s))
    );
    this.recordAudit(`Changed Society ${id} status to ${status}`, `Society ${id}`, status === 'Suspended' ? 'Warning' : 'Info');
  }

  addSociety(society: Omit<SocietyRecord, 'id' | 'onboardedDate'>): void {
    this.api.createSociety({
      name: society.name,
      registrationNumber: society.regNumber,
      city: society.location.split(',')[0].trim(),
      totalUnits: society.units,
      totalTowers: society.towers,
      status: society.status === 'Active' ? 'ACTIVE' : 'PENDING',
      subscriptionPlan: society.subscriptionPlan
    }).subscribe({
      next: (res) => {
        const newRecord: SocietyRecord = {
          ...society,
          id: res.data?.code || `SOC-${res.data?.id || Math.floor(1000 + Math.random() * 9000)}`,
          onboardedDate: 'Today'
        };
        this.societies.update(list => [newRecord, ...list]);
      },
      error: () => {
        const newId = `SOC-${Math.floor(1000 + Math.random() * 9000)}`;
        const newRecord: SocietyRecord = {
          ...society,
          id: newId,
          onboardedDate: 'Today'
        };
        this.societies.update(list => [newRecord, ...list]);
      }
    });
    this.recordAudit(`Onboarded new society: ${society.name}`, society.name, 'Info');
  }

  // Actions: Verification
  verifyAndAuthorizeSociety(reqId: string): void {
    const req = this.verifications().find(v => v.id === reqId);
    if (!req) return;

    const numericId = parseInt(reqId.replace(/\D/g, ''), 10);
    if (numericId) {
      this.api.updateVerificationStatus(numericId, 'VERIFIED', 'Verified by Super Admin').subscribe({ error: () => {} });
    }

    this.verifications.update(list =>
      list.map(v => (v.id === reqId ? { ...v, status: 'Verified' } : v))
    );

    // Also add to societies list as Active
    this.addSociety({
      name: req.societyName,
      regNumber: req.regNumber,
      location: req.city,
      units: req.units,
      towers: Math.ceil(req.units / 40),
      adminName: req.secretaryName,
      adminEmail: req.secretaryEmail,
      status: 'Active',
      subscriptionPlan: req.units > 200 ? 'Enterprise' : 'Professional',
      monthlyDuesVolume: `₹${(req.units * 3500).toLocaleString('en-IN')}`
    });

    // Also authorize secretary admin account
    const adminId = `ADM-${Math.floor(200 + Math.random() * 800)}`;
    this.societyAdmins.update(list => [
      {
        id: adminId,
        societyId: 'SOC-NEW',
        societyName: req.societyName,
        adminName: req.secretaryName,
        email: req.secretaryEmail,
        phone: req.phone,
        designation: 'Society Secretary',
        status: 'Authorized',
        authorizedDate: 'Today',
        lastLogin: 'Never'
      },
      ...list
    ]);

    this.recordAudit(`Verified and provisioned society instance for ${req.societyName}`, reqId, 'Info');
  }

  requestVerificationClarification(reqId: string, notes: string): void {
    const numericId = parseInt(reqId.replace(/\D/g, ''), 10);
    if (numericId) {
      this.api.updateVerificationStatus(numericId, 'REQUIRES_CLARIFICATION', notes).subscribe({ error: () => {} });
    }
    this.verifications.update(list =>
      list.map(v => (v.id === reqId ? { ...v, status: 'Requires Clarification', notes } : v))
    );
    this.recordAudit(`Requested compliance clarification for ${reqId}`, reqId, 'Warning');
  }

  // Actions: Admin Management
  toggleAdminAuthorization(adminId: string): void {
    this.societyAdmins.update(list =>
      list.map(a => {
        if (a.id === adminId) {
          const newStatus = a.status === 'Authorized' ? 'Revoked' : 'Authorized';
          return { ...a, status: newStatus };
        }
        return a;
      })
    );
    this.recordAudit(`Toggled admin privileges for ${adminId}`, adminId, 'Warning');
  }

  // Actions: User Management
  updateUserStatus(userId: string, status: 'Active' | 'Suspended' | 'Locked 2FA'): void {
    this.platformUsers.update(list =>
      list.map(u => (u.id === userId ? { ...u, status } : u))
    );
    this.recordAudit(`Updated User ${userId} status to ${status}`, userId, status === 'Suspended' ? 'Critical' : 'Info');
  }

  // Actions: Support Management
  replyToTicket(ticketId: string, replyText: string): void {
    const numericId = parseInt(ticketId.replace(/\D/g, ''), 10);
    if (numericId) {
      this.api.addSupportTicketMessage(numericId, {
        senderName: 'Super Admin Desk',
        message: replyText,
        isStaff: true
      }).subscribe({ error: () => {} });
    }
    this.supportTickets.update(list =>
      list.map(t => {
        if (t.id === ticketId) {
          const newMsg = {
            sender: 'Super Admin Desk',
            text: replyText,
            time: 'Just now',
            isStaff: true
          };
          return {
            ...t,
            status: 'In Progress',
            messages: [...t.messages, newMsg]
          };
        }
        return t;
      })
    );
    this.recordAudit(`Responded to support ticket ${ticketId}`, ticketId, 'Info');
  }

  resolveTicket(ticketId: string): void {
    const numericId = parseInt(ticketId.replace(/\D/g, ''), 10);
    if (numericId) {
      this.api.updateSupportTicketStatus(numericId, 'RESOLVED').subscribe({ error: () => {} });
    }
    this.supportTickets.update(list =>
      list.map(t => (t.id === ticketId ? { ...t, status: 'Resolved' } : t))
    );
    this.recordAudit(`Marked support ticket ${ticketId} as Resolved`, ticketId, 'Info');
  }

  private recordAudit(action: string, target: string, severity: 'Info' | 'Warning' | 'Critical'): void {
    const newLog: AuditLogItem = {
      id: `LOG-${Math.floor(9500 + Math.random() * 500)}`,
      timestamp: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
      actor: 'Super Admin (Dhanashree Kadawale)',
      actorRole: 'Platform Super Admin',
      ipAddress: '103.21.144.12 (VPN)',
      action,
      target,
      severity
    };
    this.auditLogs.update(logs => [newLog, ...logs]);
  }
}
