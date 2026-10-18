import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MockDataService } from '../../services/mock-data.service';

export interface SocietyPoll {
  id: string;
  question: string;
  description: string;
  targetAudience: 'All Residents' | 'Flat Owners Only';
  status: 'Active' | 'Closed';
  endDate: string;
  totalVotes: number;
  options: {
    id: string;
    text: string;
    votes: number;
    userVoted?: boolean;
  }[];
}

export interface SocietyReport {
  id: string;
  title: string;
  category: 'Financial' | 'Maintenance' | 'Security' | 'Occupancy';
  period: string;
  generatedOn: string;
  fileSize: string;
  format: 'PDF' | 'XLSX';
  summary: string;
}

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reports.html',
  styleUrl: './reports.css'
})
export class ReportsPageComponent implements OnInit {
  public mockData = inject(MockDataService);

  public activeTab = signal<'polls' | 'reports'>('polls');

  // Polls Data
  public polls = signal<SocietyPoll[]>([
    {
      id: 'POL-001',
      question: 'Install 50kW Rooftop Solar Power System on Towers A & B',
      description: 'Capital cost of ₹22 Lakhs to be funded 50% from Sinking Reserve and 50% from State Green Subsidy. Expected electricity savings: ₹1.4 Lakhs/month.',
      targetAudience: 'Flat Owners Only',
      status: 'Active',
      endDate: '25 Oct 2026',
      totalVotes: 148,
      options: [
        { id: 'opt1', text: 'Yes, proceed with Solar Vendor Tender', votes: 118 },
        { id: 'opt2', text: 'No, postpone till next financial year', votes: 22 },
        { id: 'opt3', text: 'Need more technical clarification in AGM', votes: 8 }
      ]
    },
    {
      id: 'POL-002',
      question: 'Diwali 2026 Grand Celebration & Community Dinner Timings',
      description: 'Managing committee is finalizing catering and fireworks safety guidelines for the 29th October celebration in the central courtyard.',
      targetAudience: 'All Residents',
      status: 'Active',
      endDate: '22 Oct 2026',
      totalVotes: 112,
      options: [
        { id: 'opt1', text: 'Evening Event (07:00 PM – 10:30 PM)', votes: 82 },
        { id: 'opt2', text: 'Afternoon Lunch (12:30 PM – 03:30 PM)', votes: 24 },
        { id: 'opt3', text: 'Split 2-Day Celebrations', votes: 6 }
      ]
    },
    {
      id: 'POL-003',
      question: 'Dedicated Electric Vehicle (EV) Charging Station Installation in B1',
      description: 'Proposal to partner with Tata Power to install 8 fast AC chargers with RFID metered payment billing.',
      targetAudience: 'All Residents',
      status: 'Closed',
      endDate: '10 Oct 2026',
      totalVotes: 194,
      options: [
        { id: 'opt1', text: 'In Favor of EV Charging Slots', votes: 164 },
        { id: 'opt2', text: 'Against / Prefer individual metering', votes: 21 },
        { id: 'opt3', text: 'Neutral / No vehicle', votes: 9 }
      ]
    },
    {
      id: 'POL-004',
      question: 'Replace Children Play Area Grass with High-Density Rubberized Tiles',
      description: 'Prevent injuries from falls around jungle gym and swing sets. Estimated budget ₹1.85 Lakhs.',
      targetAudience: 'All Residents',
      status: 'Closed',
      endDate: '30 Sep 2026',
      totalVotes: 172,
      options: [
        { id: 'opt1', text: 'Approve Rubberized Flooring', votes: 151 },
        { id: 'opt2', text: 'Keep Natural Grass Lawn', votes: 21 }
      ]
    }
  ]);

  // Reports Data
  public reports = signal<SocietyReport[]>([
    {
      id: 'REP-001',
      title: 'October 2026 Maintenance Collection & Arrears Ledger',
      category: 'Financial',
      period: '01 Oct – 17 Oct 2026',
      generatedOn: '17 Oct 2026',
      fileSize: '2.4 MB',
      format: 'PDF',
      summary: 'Flat-wise bill collection status, ₹18.4L collected, 8 overdue defaulters, and penalty surcharge calculations.'
    },
    {
      id: 'REP-002',
      title: 'FY 2025-26 Statutory Balance Sheet & Income/Expenditure Account',
      category: 'Financial',
      period: 'Apr 2025 – Mar 2026',
      generatedOn: '15 Aug 2026',
      fileSize: '4.8 MB',
      format: 'PDF',
      summary: 'Audited annual statements by Sunil Joshi & Associates CA. Unanimously adopted in the AGM.'
    },
    {
      id: 'REP-003',
      title: 'Annual Society Occupancy & Tenant Police Verification Audit',
      category: 'Occupancy',
      period: 'Year 2026',
      generatedOn: '01 Oct 2026',
      fileSize: '1.2 MB',
      format: 'XLSX',
      summary: '240 total units: 198 owner occupied, 38 tenants verified, 4 vacant. 100% police verification compliance.'
    },
    {
      id: 'REP-004',
      title: 'Q3 Complaint Resolution SLA & Maintenance Turnaround Report',
      category: 'Maintenance',
      period: 'July – Sept 2026',
      generatedOn: '05 Oct 2026',
      fileSize: '1.9 MB',
      format: 'PDF',
      summary: '94.2% complaints resolved within 24 hours. Top categories: Electrical (38%), Plumbing (29%), Housekeeping (21%).'
    },
    {
      id: 'REP-005',
      title: 'Perimeter Security, Visitor Traffic & Incident Register Q3',
      category: 'Security',
      period: 'July – Sept 2026',
      generatedOn: '02 Oct 2026',
      fileSize: '3.1 MB',
      format: 'PDF',
      summary: '14,820 guest passes issued, 0 security breaches, 100% delivery verification through Gate 1.'
    }
  ]);

  // Filter
  public pollFilter = signal<'ALL' | 'Active' | 'Closed'>('ALL');
  public reportCategoryFilter = signal<string>('ALL');

  // New Poll Modal
  public showCreatePollModal = signal<boolean>(false);
  public newPoll: any = {
    question: '',
    description: '',
    targetAudience: 'All Residents',
    endDate: '31 Oct 2026',
    opt1: '',
    opt2: '',
    opt3: ''
  };

  ngOnInit() {}

  public filteredPolls = computed(() => {
    const f = this.pollFilter();
    if (f === 'ALL') return this.polls();
    return this.polls().filter(p => p.status === f);
  });

  public filteredReports = computed(() => {
    const cat = this.reportCategoryFilter();
    if (cat === 'ALL') return this.reports();
    return this.reports().filter(r => r.category === cat);
  });

  getOptionPercentage(poll: SocietyPoll, votes: number): number {
    if (poll.totalVotes === 0) return 0;
    return Math.round((votes / poll.totalVotes) * 100);
  }

  castVote(poll: SocietyPoll, optId: string) {
    if (poll.status === 'Closed') {
      this.mockData.showToast({
        type: 'warning',
        title: 'Poll Closed',
        message: 'This poll has ended and is no longer accepting votes.'
      });
      return;
    }

    const opt = poll.options.find(o => o.id === optId);
    if (!opt) return;

    // Check if already voted
    const alreadyVoted = poll.options.some(o => o.userVoted);
    if (alreadyVoted) {
      this.mockData.showToast({
        type: 'info',
        title: 'Vote Already Recorded',
        message: 'Your vote is already recorded for this referendum.'
      });
      return;
    }

    opt.votes++;
    opt.userVoted = true;
    poll.totalVotes++;

    this.mockData.showToast({
      type: 'success',
      title: 'Vote Cast Successfully',
      message: `Your response "${opt.text}" has been tabulated.`
    });
  }

  openNewPollModal() {
    this.newPoll = {
      question: '',
      description: '',
      targetAudience: 'All Residents',
      endDate: '05 Nov 2026',
      opt1: 'Yes, I Agree',
      opt2: 'No, I Disagree',
      opt3: 'Need More Discussion'
    };
    this.showCreatePollModal.set(true);
  }

  closeNewPollModal() {
    this.showCreatePollModal.set(false);
  }

  submitPoll() {
    if (!this.newPoll.question.trim() || !this.newPoll.opt1.trim() || !this.newPoll.opt2.trim()) {
      this.mockData.showToast({
        type: 'error',
        title: 'Validation Error',
        message: 'Please enter poll question and at least two choices.'
      });
      return;
    }

    const options = [
      { id: 'opt1', text: this.newPoll.opt1, votes: 1, userVoted: true },
      { id: 'opt2', text: this.newPoll.opt2, votes: 0 }
    ];

    if (this.newPoll.opt3?.trim()) {
      options.push({ id: 'opt3', text: this.newPoll.opt3.trim(), votes: 0 });
    }

    const created: SocietyPoll = {
      id: 'POL-0' + (this.polls().length + 1),
      question: this.newPoll.question,
      description: this.newPoll.description || 'Society community poll posted by Secretary.',
      targetAudience: this.newPoll.targetAudience,
      status: 'Active',
      endDate: this.newPoll.endDate,
      totalVotes: 1,
      options
    };

    this.polls.update(list => [created, ...list]);
    this.closeNewPollModal();
    this.mockData.showToast({
      type: 'success',
      title: 'Poll Published',
      message: `"${created.question}" is now live for voting.`
    });
  }

  downloadReport(report: SocietyReport) {
    this.mockData.showToast({
      type: 'success',
      title: 'Generating Report',
      message: `Downloading "${report.title}" (${report.format})...`
    });
  }

  exportGeneral(format: string) {
    this.mockData.showToast({
      type: 'info',
      title: `Exporting ${format}`,
      message: `Compiling consolidated society analytics into ${format}...`
    });
  }
}
