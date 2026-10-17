import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MockDataService } from '../../services/mock-data.service';
import { MaintenanceBill } from '../../models/models';

@Component({
  selector: 'app-billing',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './billing.html',
  styleUrl: './billing.css'
})
export class BillingComponent implements OnInit {
  public mockData = inject(MockDataService);

  public bills = signal<MaintenanceBill[]>([]);
  public searchQuery = signal<string>('');
  public selectedStatus = signal<string>('ALL');
  public selectedMonth = signal<string>('October');
  public selectedTower = signal<string>('ALL');

  // Modals
  public showGenerateModal = signal<boolean>(false);
  public showPaymentModal = signal<boolean>(false);
  public showInvoiceModal = signal<boolean>(false);
  public selectedBill = signal<MaintenanceBill | null>(null);

  // Forms
  public generateForm = {
    month: 'November',
    year: 2026,
    ratePerSqFt: 3.5,
    dueDate: '2026-11-10',
    includeParking: true
  };

  public paymentForm = {
    flatNumber: '',
    amount: 3500,
    paymentMethod: 'UPI',
    referenceNumber: '',
    paymentDate: new Date().toISOString().split('T')[0]
  };

  ngOnInit() {
    this.bills.set(this.mockData.getMaintenanceBills());
  }

  // Filtered bills
  public filteredBills = computed(() => {
    let list = this.bills();
    const q = this.searchQuery().toLowerCase().trim();
    const status = this.selectedStatus();
    const tower = this.selectedTower();

    if (q) {
      list = list.filter(b =>
        b.flatNumber.toLowerCase().includes(q) ||
        b.residentName.toLowerCase().includes(q) ||
        b.building.toLowerCase().includes(q)
      );
    }
    if (status !== 'ALL') {
      list = list.filter(b => b.status === status);
    }
    if (tower !== 'ALL') {
      list = list.filter(b => b.building === tower);
    }
    return list;
  });

  // KPI calculations
  public totalBilled = computed(() => this.bills().reduce((acc, b) => acc + b.amount, 0));
  public totalCollected = computed(() =>
    this.bills().filter(b => b.status === 'Paid').reduce((acc, b) => acc + b.amount, 0)
  );
  public totalPending = computed(() =>
    this.bills().filter(b => b.status === 'Pending').reduce((acc, b) => acc + b.amount, 0)
  );
  public totalOverdue = computed(() =>
    this.bills().filter(b => b.status === 'Overdue').reduce((acc, b) => acc + b.amount, 0)
  );

  // Actions
  openGenerateModal() {
    this.showGenerateModal.set(true);
  }

  closeGenerateModal() {
    this.showGenerateModal.set(false);
  }

  generateBills() {
    this.mockData.showToast({
      type: 'success',
      title: 'Bills Generated',
      message: `Maintenance bills for ${this.generateForm.month} 2026 have been generated for all 240 flats.`
    });
    this.closeGenerateModal();
  }

  openPaymentModal(bill?: MaintenanceBill) {
    if (bill) {
      this.selectedBill.set(bill);
      this.paymentForm.flatNumber = bill.flatNumber;
      this.paymentForm.amount = bill.amount;
    } else {
      this.paymentForm.flatNumber = '';
      this.paymentForm.amount = 3500;
    }
    this.showPaymentModal.set(true);
  }

  closePaymentModal() {
    this.showPaymentModal.set(false);
  }

  recordPayment() {
    const flat = this.paymentForm.flatNumber;
    this.bills.update(prev =>
      prev.map(b => (b.flatNumber === flat ? { ...b, status: 'Paid', paidDate: this.paymentForm.paymentDate } : b))
    );
    this.mockData.showToast({
      type: 'success',
      title: 'Payment Recorded',
      message: `Payment of ₹${this.paymentForm.amount} recorded for Flat ${flat} via ${this.paymentForm.paymentMethod}.`
    });
    this.closePaymentModal();
  }

  openInvoiceModal(bill: MaintenanceBill) {
    this.selectedBill.set(bill);
    this.showInvoiceModal.set(true);
  }

  closeInvoiceModal() {
    this.showInvoiceModal.set(false);
  }

  downloadReceipt(bill: MaintenanceBill) {
    this.mockData.showToast({
      type: 'info',
      title: 'Invoice Downloaded',
      message: `Invoice for Flat ${bill.flatNumber} (${bill.month} ${bill.year}) downloaded.`
    });
  }

  sendReminder(bill: MaintenanceBill) {
    this.mockData.showToast({
      type: 'warning',
      title: 'Reminder Sent',
      message: `SMS & Email payment reminder dispatched to ${bill.residentName} (${bill.flatNumber}).`
    });
  }
}
