import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MockDataService } from '../../services/mock-data.service';
import { AuthService } from '../../services/auth.service';

export interface CommitteeMember {
  id: string;
  name: string;
  designation: 'Chairman' | 'Secretary' | 'Treasurer' | 'Committee Member';
  flatNumber: string;
  phone: string;
  email: string;
  termEnd: string;
}

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './settings.html',
  styleUrl: './settings.css'
})
export class SettingsPageComponent implements OnInit {
  public mockData = inject(MockDataService);
  public authService = inject(AuthService, { optional: true });

  public activeTab = signal<'profile' | 'billing' | 'bank' | 'committee'>('profile');

  // General Profile
  public societyProfile = {
    name: 'Greenwood Heights Co-operative Housing Society Ltd.',
    regNumber: 'REG/PUN/2018/4592 (MCS Act 1960)',
    address: 'Survey No. 42/1, Off Baner-Pashan Link Road',
    city: 'Pune',
    state: 'Maharashtra',
    pincode: '411045',
    totalFlats: 240,
    totalTowers: 4,
    societyEmail: 'secretary@greenwoodheights.org',
    secretaryPhone: '+91 98220 44556',
    gateIntercom: '4001',
    gateMobile: '+91 98220 99111'
  };

  // Billing & Rules
  public billingRules = {
    monthlyMaintenance: 3500,
    billGenDay: 1,
    dueDay: 10,
    graceDays: 10,
    latePenaltyPercent: 2,
    sinkingFundPercent: 0.25,
    autoReminderDays: '3 days before due date',
    sendSmsAlerts: true,
    sendEmailInvoices: true
  };

  // Bank & UPI
  public bankDetails = {
    bankName: 'HDFC Bank Ltd.',
    accountName: 'Greenwood Heights CHS Maintenance Account',
    accountNumber: '50200084920194',
    ifscCode: 'HDFC0001244',
    branch: 'Baner High Street Branch, Pune',
    upiId: 'societysync.greenwood@hdfcbank',
    qrPaymentActive: true
  };

  // Managing Committee
  public committeeMembers = signal<CommitteeMember[]>([
    {
      id: 'CM-01',
      name: 'Dr. Ashok Kulkarni',
      designation: 'Chairman',
      flatNumber: 'B-402 (Cedar Woods)',
      phone: '+91 98220 11001',
      email: 'ashok.kulkarni@greenwoodheights.org',
      termEnd: 'September 2028'
    },
    {
      id: 'CM-02',
      name: 'Rahul Verma',
      designation: 'Secretary',
      flatNumber: 'A-204 (Palm Grove)',
      phone: '+91 98220 44556',
      email: 'rahul.verma@greenwoodheights.org',
      termEnd: 'September 2028'
    },
    {
      id: 'CM-03',
      name: 'Mrs. Sunita Deshmukh',
      designation: 'Treasurer',
      flatNumber: 'C-301 (Pine Crest)',
      phone: '+91 98220 22002',
      email: 'sunita.d@greenwoodheights.org',
      termEnd: 'September 2028'
    },
    {
      id: 'CM-04',
      name: 'Col. Rajesh Bakshi (Retd.)',
      designation: 'Committee Member',
      flatNumber: 'D-501 (Maple Court)',
      phone: '+91 98220 33003',
      email: 'rajesh.bakshi@greenwoodheights.org',
      termEnd: 'September 2028'
    },
    {
      id: 'CM-05',
      name: 'Vikramaditya Rao',
      designation: 'Committee Member',
      flatNumber: 'A-702 (Palm Grove)',
      phone: '+91 98220 55005',
      email: 'vikram.rao@greenwoodheights.org',
      termEnd: 'September 2028'
    }
  ]);

  // Modal
  public showAddMemberModal = signal<boolean>(false);
  public newMember: any = {
    name: '',
    designation: 'Committee Member',
    flatNumber: 'A-101',
    phone: '',
    email: '',
    termEnd: 'September 2028'
  };

  ngOnInit() {
    const user = this.authService?.currentUser();
    if (user) {
      if (user.societyName) {
        this.societyProfile.name = user.societyName;
      }
      if (user.email) {
        this.societyProfile.societyEmail = user.email;
      }
      if (user.phone) {
        this.societyProfile.secretaryPhone = user.phone;
      }

      this.committeeMembers.update(members =>
        members.map(m => {
          if (m.designation === 'Secretary') {
            return {
              ...m,
              name: user.name || m.name,
              email: user.email || m.email,
              phone: user.phone || m.phone,
              flatNumber: (user.flat || 'A-101') + ' (Tower A)'
            };
          }
          return m;
        })
      );
    }
  }

  saveProfile() {
    this.mockData.showToast({
      type: 'success',
      title: 'Settings Saved',
      message: 'Society profile and registration details updated successfully.'
    });
  }

  saveBillingRules() {
    this.mockData.showToast({
      type: 'success',
      title: 'Rules Updated',
      message: 'Maintenance billing cycles and penalty parameters have been applied.'
    });
  }

  saveBankDetails() {
    this.mockData.showToast({
      type: 'success',
      title: 'Banking Details Saved',
      message: 'Bank account and UPI payment receiver configurations verified.'
    });
  }

  testBankPing() {
    this.mockData.showToast({
      type: 'info',
      title: 'Bank API Ping Verified',
      message: 'Connected to HDFC Bank Webhooks. Automated reconciliation active.'
    });
  }

  openAddMemberModal() {
    this.newMember = {
      name: '',
      designation: 'Committee Member',
      flatNumber: 'B-102',
      phone: '',
      email: '',
      termEnd: 'September 2028'
    };
    this.showAddMemberModal.set(true);
  }

  closeAddMemberModal() {
    this.showAddMemberModal.set(false);
  }

  submitMember() {
    if (!this.newMember.name.trim() || !this.newMember.phone.trim()) {
      this.mockData.showToast({
        type: 'error',
        title: 'Validation Error',
        message: 'Please provide full name and contact number.'
      });
      return;
    }

    const member: CommitteeMember = {
      id: 'CM-0' + (this.committeeMembers().length + 1),
      name: this.newMember.name,
      designation: this.newMember.designation,
      flatNumber: this.newMember.flatNumber,
      phone: this.newMember.phone,
      email: this.newMember.email || `${this.newMember.name.toLowerCase().replace(/\s+/g, '.')}@greenwoodheights.org`,
      termEnd: this.newMember.termEnd
    };

    this.committeeMembers.update(list => [...list, member]);
    this.closeAddMemberModal();
    this.mockData.showToast({
      type: 'success',
      title: 'Committee Member Added',
      message: `${member.name} registered as ${member.designation}.`
    });
  }
}
