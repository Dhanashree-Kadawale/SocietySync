import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MockDataService } from '../../services/mock-data.service';
import { AuthService } from '../../services/auth.service';

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
  public authService = inject(AuthService, { optional: true });

  public expenses = computed<ExpenseVoucher[]>(() => {
    return this.mockData.expenses().map((e, idx) => ({
      id: e.id,
      voucherNumber: 'VOU-' + e.id,
      title: e.title,
      category: (e.category || 'Maintenance') as any,
      amount: e.amount,
      date: e.date,
      vendor: e.vendor,
      paymentMethod: 'Bank Transfer',
      status: (e.status === 'Approved' ? 'Approved' : (e.status === 'Rejected' ? 'Rejected' : 'Pending')) as any,
      approvedBy: e.approvedBy || 'Managing Committee',
      description: e.title,
      invoiceFile: 'Invoice_' + e.id + '.pdf'
    }));
  });

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

    this.mockData.addExpense({
      title: this.voucherForm.title,
      category: this.voucherForm.category,
      amount: Number(this.voucherForm.amount),
      date: new Date().toISOString().split('T')[0],
      vendor: this.voucherForm.vendor
    });
    this.closeAddModal();
  }

  approveVoucher(voucher: ExpenseVoucher, event?: Event) {
    if (event) event.stopPropagation();
    this.mockData.updateExpenseStatus(voucher.id, 'APPROVED');
  }

  rejectVoucher(voucher: ExpenseVoucher, event?: Event) {
    if (event) event.stopPropagation();
    this.mockData.updateExpenseStatus(voucher.id, 'REJECTED');
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
