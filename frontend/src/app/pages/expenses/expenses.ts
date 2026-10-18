import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MockDataService } from '../../services/mock-data.service';

export interface ExpenseVoucher {
  id: string;
  voucherNumber: string;
  title: string;
  category: 'Utilities' | 'Maintenance' | 'Security' | 'Housekeeping' | 'Landscaping' | 'Administration';
  amount: number;
  date: string;
  vendor: string;
  paymentMethod: 'Bank Transfer' | 'Cheque' | 'UPI' | 'Direct Debit';
  status: 'Approved' | 'Pending' | 'Rejected';
  approvedBy: string;
  description: string;
  invoiceFile?: string;
}

@Component({
  selector: 'app-expenses',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './expenses.html',
  styleUrl: './expenses.css'
})
export class ExpensesPageComponent implements OnInit {
  public mockData = inject(MockDataService);

  public expenses = signal<ExpenseVoucher[]>([
    {
      id: 'EXP-101',
      voucherNumber: 'VOU-2026-104',
      title: 'DG Set Diesel Fuel Replenishment (1,200 Litres)',
      category: 'Utilities',
      amount: 114000,
      date: '15 Oct 2026',
      vendor: 'Indian Oil Bharat Petroleum Depot',
      paymentMethod: 'Bank Transfer',
      status: 'Approved',
      approvedBy: 'Rahul Verma (Secretary)',
      description: 'Diesel replenishment for 250 kVA backup generators during scheduled grid maintenance.',
      invoiceFile: 'IOCL_Diesel_Invoice_Oct26.pdf'
    },
    {
      id: 'EXP-102',
      voucherNumber: 'VOU-2026-105',
      title: 'Quarterly Otis Elevator Comprehensive AMC (Towers A-D)',
      category: 'Maintenance',
      amount: 128000,
      date: '12 Oct 2026',
      vendor: 'Otis Elevator India Ltd.',
      paymentMethod: 'Cheque',
      status: 'Approved',
      approvedBy: 'Managing Committee',
      description: 'Q3 routine servicing, governor rope test, and door sensor replacement across 8 lifts.',
      invoiceFile: 'Otis_Q3_Maintenance_Contract.pdf'
    },
    {
      id: 'EXP-103',
      voucherNumber: 'VOU-2026-106',
      title: 'Security Guard Agency Monthly Contract (12 Guards + 1 Gunman)',
      category: 'Security',
      amount: 228000,
      date: '10 Oct 2026',
      vendor: 'HawkEye Security & Facility Services',
      paymentMethod: 'Bank Transfer',
      status: 'Approved',
      approvedBy: 'Rahul Verma (Secretary)',
      description: 'Monthly payroll settlement for 24x7 gate security, basement guards, and boom barrier operation.',
      invoiceFile: 'HawkEye_Security_Oct_Invoice.pdf'
    },
    {
      id: 'EXP-104',
      voucherNumber: 'VOU-2026-107',
      title: 'Common Area MSEB High Tension Electricity Bill',
      category: 'Utilities',
      amount: 162400,
      date: '08 Oct 2026',
      vendor: 'State Electricity Distribution Co.',
      paymentMethod: 'Direct Debit',
      status: 'Approved',
      approvedBy: 'Rahul Verma (Secretary)',
      description: 'Common electricity consumption for corridor lights, booster pumps, STP, and street lighting.',
      invoiceFile: 'MSEB_HT_Bill_September.pdf'
    },
    {
      id: 'EXP-105',
      voucherNumber: 'VOU-2026-108',
      title: 'Swimming Pool Deep Clean & Chlorination Chemical Supplies',
      category: 'Maintenance',
      amount: 24500,
      date: '16 Oct 2026',
      vendor: 'AquaClean Pool Systems',
      paymentMethod: 'UPI',
      status: 'Pending',
      approvedBy: 'Awaiting Committee Approval',
      description: 'Purchase of 50kg TCCA 90 chlorine granules, pH regulator, and sand filter backwash service.',
      invoiceFile: 'AquaClean_Chemicals_Vouch.pdf'
    },
    {
      id: 'EXP-106',
      voucherNumber: 'VOU-2026-109',
      title: 'Garden Fertilizer & Automated Sprinkler Pipe Replacement',
      category: 'Landscaping',
      amount: 18750,
      date: '14 Oct 2026',
      vendor: 'GreenThumb Landscapers',
      paymentMethod: 'UPI',
      status: 'Approved',
      approvedBy: 'Rahul Verma (Secretary)',
      description: 'Organic compost manure for central lawn and repair of 4 leaking drip sprinkler lines.',
      invoiceFile: 'GreenThumb_Gardening_Bill.pdf'
    },
    {
      id: 'EXP-107',
      voucherNumber: 'VOU-2026-110',
      title: 'Basement Stormwater Sump Pump Motor Rewinding',
      category: 'Maintenance',
      amount: 32000,
      date: '17 Oct 2026',
      vendor: 'Star Rewinding & Pumps',
      paymentMethod: 'Cheque',
      status: 'Pending',
      approvedBy: 'Awaiting Secretary Review',
      description: 'Emergency bearing replacement and copper rewinding of 7.5 HP dewatering pump in Basement B2.',
      invoiceFile: 'Pump_Rewind_Estimate.pdf'
    },
    {
      id: 'EXP-108',
      voucherNumber: 'VOU-2026-111',
      title: 'Annual Statutory Audit & Tax Filing Professional Fee',
      category: 'Administration',
      amount: 45000,
      date: '02 Oct 2026',
      vendor: 'Sunil Joshi & Associates Chartered Accountants',
      paymentMethod: 'Bank Transfer',
      status: 'Approved',
      approvedBy: 'Managing Committee',
      description: 'Final audit certification, preparation of Form I & Form J, and GST annual reconciliation.',
      invoiceFile: 'CA_Audit_Fee_Receipt.pdf'
    }
  ]);

  // Filters
  public selectedCategory = signal<string>('ALL');
  public selectedStatus = signal<string>('ALL');
  public searchQuery = signal<string>('');

  // Modals
  public showAddVoucherModal = signal<boolean>(false);
  public showDetailModal = signal<boolean>(false);
  public activeVoucher = signal<ExpenseVoucher | null>(null);

  // Form
  public voucherForm: any = {
    title: '',
    category: 'Maintenance',
    amount: 15000,
    vendor: '',
    paymentMethod: 'Bank Transfer',
    description: '',
    voucherNumber: 'VOU-2026-112',
    date: 'Today, 18 Oct 2026'
  };

  ngOnInit() {}

  public filteredExpenses = computed(() => {
    let list = this.expenses();
    const cat = this.selectedCategory();
    const stat = this.selectedStatus();
    const q = this.searchQuery().toLowerCase().trim();

    if (cat !== 'ALL') {
      list = list.filter(e => e.category === cat);
    }

    if (stat !== 'ALL') {
      list = list.filter(e => e.status === stat);
    }

    if (q) {
      list = list.filter(e =>
        e.title.toLowerCase().includes(q) ||
        e.vendor.toLowerCase().includes(q) ||
        e.voucherNumber.toLowerCase().includes(q) ||
        e.description.toLowerCase().includes(q)
      );
    }

    return list;
  });

  // KPI Computations
  public totalMonthlyExpense = computed(() => {
    const sum = this.expenses()
      .filter(e => e.status === 'Approved')
      .reduce((acc, curr) => acc + curr.amount, 0);
    return `₹${(sum / 100000).toFixed(2)} Lakh`;
  });

  public pendingApprovalCount = computed(() =>
    this.expenses().filter(e => e.status === 'Pending').length
  );

  public pendingApprovalAmount = computed(() => {
    const sum = this.expenses()
      .filter(e => e.status === 'Pending')
      .reduce((acc, curr) => acc + curr.amount, 0);
    return `₹${(sum / 1000).toFixed(1)}K`;
  });

  public approvedCount = computed(() =>
    this.expenses().filter(e => e.status === 'Approved').length
  );

  openAddModal() {
    this.voucherForm = {
      title: '',
      category: 'Maintenance',
      amount: null,
      vendor: '',
      paymentMethod: 'Bank Transfer',
      description: '',
      voucherNumber: 'VOU-2026-' + Math.floor(115 + Math.random() * 50),
      date: '18 Oct 2026'
    };
    this.showAddVoucherModal.set(true);
  }

  closeAddModal() {
    this.showAddVoucherModal.set(false);
  }

  submitVoucher() {
    if (!this.voucherForm.title.trim() || !this.voucherForm.amount || !this.voucherForm.vendor.trim()) {
      this.mockData.showToast({
        type: 'error',
        title: 'Validation Error',
        message: 'Please provide expense title, vendor name, and valid amount.'
      });
      return;
    }

    const newVoucher: ExpenseVoucher = {
      id: 'EXP-' + (this.expenses().length + 105),
      voucherNumber: this.voucherForm.voucherNumber,
      title: this.voucherForm.title,
      category: this.voucherForm.category,
      amount: Number(this.voucherForm.amount),
      date: this.voucherForm.date,
      vendor: this.voucherForm.vendor,
      paymentMethod: this.voucherForm.paymentMethod,
      status: 'Pending',
      approvedBy: 'Awaiting Secretary Review',
      description: this.voucherForm.description || 'Logged via Secretary Expense Portal.',
      invoiceFile: 'Voucher_Receipt_' + this.voucherForm.voucherNumber + '.pdf'
    };

    this.expenses.update(list => [newVoucher, ...list]);
    this.closeAddModal();
    this.mockData.showToast({
      type: 'success',
      title: 'Voucher Recorded',
      message: `Voucher ${newVoucher.voucherNumber} for ₹${newVoucher.amount.toLocaleString()} created.`
    });
  }

  approveVoucher(voucher: ExpenseVoucher, event?: Event) {
    if (event) event.stopPropagation();
    voucher.status = 'Approved';
    voucher.approvedBy = 'Rahul Verma (Secretary)';

    this.mockData.showToast({
      type: 'success',
      title: 'Voucher Approved',
      message: `Voucher ${voucher.voucherNumber} approved for payment release.`
    });
  }

  rejectVoucher(voucher: ExpenseVoucher, event?: Event) {
    if (event) event.stopPropagation();
    voucher.status = 'Rejected';
    voucher.approvedBy = 'Rejected by Rahul Verma';

    this.mockData.showToast({
      type: 'warning',
      title: 'Voucher Rejected',
      message: `Voucher ${voucher.voucherNumber} marked as rejected.`
    });
  }

  viewVoucherDetails(voucher: ExpenseVoucher) {
    this.activeVoucher.set(voucher);
    this.showDetailModal.set(true);
  }

  closeDetailModal() {
    this.showDetailModal.set(false);
    this.activeVoucher.set(null);
  }

  downloadReceipt(voucher: ExpenseVoucher, event?: Event) {
    if (event) event.stopPropagation();
    this.mockData.showToast({
      type: 'info',
      title: 'Downloading Invoice',
      message: `Downloading receipt for ${voucher.voucherNumber}...`
    });
  }
}
