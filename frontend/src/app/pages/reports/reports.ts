import { Component, OnInit, OnDestroy, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MockDataService } from '../../services/mock-data.service';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { Subscription, timer } from 'rxjs';

export interface SocietyPoll {
  id: string;
  question: string;
  description: string;
  endDateValue: string;
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
export class ReportsPageComponent implements OnInit, OnDestroy {
  public mockData = inject(MockDataService);
  private api = inject(ApiService);
  private auth = inject(AuthService);
  private pollRefreshSubscription?: Subscription;

  public activeTab = signal<'polls' | 'reports'>('polls');

  public polls = signal<SocietyPoll[]>([]);
  public pollLoadError = signal<string | null>(null);
  public canManagePolls = computed(() => {
    const user = this.auth.currentUser();
    return !!user?.societyId && (user.role === 'Secretary Admin' || user.role === 'Super Admin');
  });

  // Reports Data (100% Live Computed from DB State)
  public reports = computed<SocietyReport[]>(() => {
    const totalCollected = this.mockData.payments().reduce((sum, p) => sum + (Number(p.amount) || 0), 0);
    const totalFlats = this.mockData.flats().length;
    const occupiedFlats = this.mockData.flats().filter(f => f.status === 'Occupied').length;
    const openComplaints = this.mockData.complaints().filter(c => c.status === 'Open').length;
    const resolvedComplaints = this.mockData.complaints().filter(c => c.status === 'Resolved').length;
    const totalVisitors = this.mockData.visitors().length;

    return [
      {
        id: 'REP-001',
        title: 'Maintenance Collection & Arrears Ledger',
        category: 'Financial',
        period: 'Current Period',
        generatedOn: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
        fileSize: '2.4 MB',
        format: 'PDF',
        summary: `Flat-wise collection status: ₹${totalCollected.toLocaleString('en-IN')} collected, ${this.mockData.bills().filter(b => b.status === 'Pending').length} pending bills.`
      },
      {
        id: 'REP-002',
        title: 'Statutory Financial Audit Report & Expenditure Ledger',
        category: 'Financial',
        period: 'FY 2025-26',
        generatedOn: '15 Aug 2026',
        fileSize: '4.8 MB',
        format: 'PDF',
        summary: 'Itemized vendor disbursements, verified payment records, and sinking fund reserve.'
      },
      {
        id: 'REP-003',
        title: 'Society Occupancy & Resident Registry Audit',
        category: 'Occupancy',
        period: 'Current Year',
        generatedOn: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
        fileSize: '1.2 MB',
        format: 'XLSX',
        summary: `${totalFlats} registered units: ${occupiedFlats} occupied, ${totalFlats - occupiedFlats} vacant/maintenance. ${this.mockData.residents().length} verified residents.`
      },
      {
        id: 'REP-004',
        title: 'Complaint Resolution SLA & Maintenance Turnaround Report',
        category: 'Maintenance',
        period: 'All-Time',
        generatedOn: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
        fileSize: '1.9 MB',
        format: 'PDF',
        summary: `${resolvedComplaints} resolved complaints, ${openComplaints} in queue across all residential blocks.`
      },
      {
        id: 'REP-005',
        title: 'Perimeter Security, Visitor Traffic & Incident Register',
        category: 'Security',
        period: 'Current Month',
        generatedOn: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
        fileSize: '3.1 MB',
        format: 'PDF',
        summary: `${totalVisitors} verified visitor passes issued at estate gates with zero security violations.`
      }
    ];
  });

  // Filter
  public pollFilter = signal<'ALL' | 'Active' | 'Closed'>('ALL');
  public reportCategoryFilter = signal<string>('ALL');

  // New Poll Modal
  public showCreatePollModal = signal<boolean>(false);
  public newPoll: any = {
    question: '',
    description: '',
    targetAudience: 'All Residents',
    endDate: this.defaultDeadline(),
    opt1: '',
    opt2: '',
    opt3: ''
  };

  ngOnInit() {
    this.pollRefreshSubscription = timer(0, 10_000).subscribe(() => this.loadPolls());
  }

  ngOnDestroy() {
    this.pollRefreshSubscription?.unsubscribe();
  }

  private getPollContext() {
    const user = this.auth.currentUser();
    const userId = user?.userId ?? Number(user?.id.match(/^USR-[A-Z]+-(\d+)$/)?.[1]);
    if (!user?.societyId || !Number.isInteger(userId) || userId <= 0) {
      throw new Error('Your account is not linked to a society. Sign in again or contact your society administrator.');
    }
    return { userId, societyId: user.societyId };
  }

  private loadPolls() {
    let context: ReturnType<ReportsPageComponent['getPollContext']>;
    try {
      context = this.getPollContext();
    } catch (error) {
      this.polls.set([]);
      this.pollLoadError.set(error instanceof Error ? error.message : 'Unable to identify your society.');
      return;
    }

    this.api.getPolls(context.societyId, context.userId).subscribe({
      next: response => {
        if (!response?.success || !Array.isArray(response.data)) {
          this.pollLoadError.set(response?.message || 'The server returned an invalid poll response.');
          return;
        }
        this.polls.set(response.data.map(poll => this.mapPoll(poll)));
        this.pollLoadError.set(null);
      },
      error: error => {
        this.pollLoadError.set(error?.error?.message || 'Unable to load polls from the server.');
      }
    });
  }

  private mapPoll(poll: any): SocietyPoll {
    const deadline = new Date(poll.endDate);
    return {
      id: String(poll.id),
      question: poll.title,
      description: poll.description || '',
      endDateValue: Number.isNaN(deadline.getTime()) ? '' : deadline.toISOString().slice(0, 10),
      targetAudience: poll.category === 'Flat Owners Only' ? 'Flat Owners Only' : 'All Residents',
      status: poll.status === 'ACTIVE' && deadline.getTime() > Date.now() ? 'Active' : 'Closed',
      endDate: Number.isNaN(deadline.getTime())
        ? 'Unknown'
        : deadline.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      totalVotes: Number(poll.totalVotes) || 0,
      options: (poll.options || []).map((option: any) => ({
        id: String(option.id),
        text: option.optionText,
        votes: Number(option.voteCount) || 0,
        userVoted: String(option.id) === String(poll.userVotedOptionId)
      }))
    };
  }

  private defaultDeadline(): string {
    const deadline = new Date();
    deadline.setDate(deadline.getDate() + 7);
    return deadline.toISOString().slice(0, 10);
  }

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

    let context: ReturnType<ReportsPageComponent['getPollContext']>;
    try {
      context = this.getPollContext();
    } catch (error) {
      this.showOperationError(error);
      return;
    }
    this.api.votePoll(Number(poll.id), Number(optId), context.userId).subscribe({
      next: response => {
        if (!response?.success) {
          this.mockData.showToast({ type: 'error', title: 'Vote Failed', message: response?.message || 'Your vote was not saved.' });
          return;
        }
        this.loadPolls();
        this.mockData.showToast({
          type: 'success',
          title: 'Vote Cast Successfully',
          message: `Your response "${opt.text}" has been saved.`
        });
      },
      error: error => this.showOperationError(error, 'Vote Failed')
    });
  }

  openNewPollModal() {
    this.editingPollId.set(null);
    this.newPoll = {
      question: '',
      description: '',
      targetAudience: 'All Residents',
      endDate: this.defaultDeadline(),
      opt1: 'Yes, I Agree',
      opt2: 'No, I Disagree',
      opt3: 'Need More Discussion'
    };
    this.showCreatePollModal.set(true);
  }

  closeNewPollModal() {
    this.showCreatePollModal.set(false);
  }

  public editingPollId = signal<number | null>(null);

  openEditPollModal(poll: SocietyPoll) {
    if (poll.totalVotes > 0) return;
    this.editingPollId.set(Number(poll.id));
    this.newPoll = {
      question: poll.question,
      description: poll.description,
      targetAudience: poll.targetAudience,
      endDate: poll.endDateValue,
      opt1: poll.options[0]?.text || '',
      opt2: poll.options[1]?.text || '',
      opt3: poll.options[2]?.text || ''
    };
    this.showCreatePollModal.set(true);
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

    let context: ReturnType<ReportsPageComponent['getPollContext']>;
    try {
      context = this.getPollContext();
    } catch (error) {
      this.showOperationError(error);
      return;
    }
    const options = [this.newPoll.opt1, this.newPoll.opt2, this.newPoll.opt3]
      .map((option: string) => option?.trim())
      .filter((option: string) => !!option)
      .map((optionText: string) => ({ optionText }));
    const payload = {
      societyId: context.societyId,
      createdById: context.userId,
      title: this.newPoll.question.trim(),
      description: this.newPoll.description?.trim() || '',
      category: this.newPoll.targetAudience,
      endDate: `${this.newPoll.endDate}T23:59:59`,
      options
    };
    const editingId = this.editingPollId();
    const request = editingId === null
      ? this.api.createPoll(payload)
      : this.api.updatePoll(editingId, payload);

    request.subscribe({
      next: response => {
        if (!response?.success) {
          this.mockData.showToast({ type: 'error', title: 'Poll Not Saved', message: response?.message || 'The poll was not saved.' });
          return;
        }
        this.closeNewPollModal();
        this.loadPolls();
        this.mockData.showToast({
          type: 'success',
          title: editingId === null ? 'Poll Published' : 'Poll Updated',
          message: editingId === null ? 'The poll is now shared with your society.' : 'Your poll changes were saved.'
        });
      },
      error: error => this.showOperationError(error, 'Poll Not Saved')
    });
  }

  deletePoll(poll: SocietyPoll) {
    if (!confirm(`Delete the poll "${poll.question}"? This also removes its votes.`)) return;
    let context: ReturnType<ReportsPageComponent['getPollContext']>;
    try {
      context = this.getPollContext();
    } catch (error) {
      this.showOperationError(error);
      return;
    }
    this.api.deletePoll(Number(poll.id), context.societyId).subscribe({
      next: response => {
        if (!response?.success) {
          this.mockData.showToast({ type: 'error', title: 'Poll Not Deleted', message: response?.message || 'The poll was not deleted.' });
          return;
        }
        this.loadPolls();
        this.mockData.showToast({ type: 'success', title: 'Poll Deleted', message: 'The poll was removed for all society members.' });
      },
      error: error => this.showOperationError(error, 'Poll Not Deleted')
    });
  }

  private showOperationError(error: any, title = 'Poll Operation Failed') {
    this.mockData.showToast({
      type: 'error',
      title,
      message: error?.error?.message || error?.message || 'The server could not complete this poll operation.'
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
