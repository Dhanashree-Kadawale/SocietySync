import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MockDataService } from '../../services/mock-data.service';
import { AuthService } from '../../services/auth.service';
import { Visitor } from '../../models/models';

@Component({
  selector: 'app-visitors-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './visitors.html',
  styleUrl: './visitors.css'
})
export class VisitorsPageComponent {
  public mockData = inject(MockDataService);
  public authService = inject(AuthService, { optional: true });

  public visitors = this.mockData.visitors;
  public searchQuery = signal<string>('');
  public selectedStatus = signal<string>('ALL');

  public showPreApproveModal = signal<boolean>(false);

  public visitorForm = {
    name: '',
    phone: '',
    purpose: 'Guest',
    hostResident: '',
    flatNumber: '',
    vehicleNumber: ''
  };

  public filteredVisitors = computed(() => {
    let list = this.visitors();
    const q = this.searchQuery().toLowerCase().trim();
    const status = this.selectedStatus();

    if (q) {
      list = list.filter(v =>
        v.name.toLowerCase().includes(q) ||
        v.flatNumber.toLowerCase().includes(q) ||
        v.hostResident.toLowerCase().includes(q) ||
        v.purpose.toLowerCase().includes(q)
      );
    }
    if (status !== 'ALL') list = list.filter(v => v.status === status);
    return list;
  });

  public insideCount = computed(() => this.visitors().filter(v => v.status === 'In').length);
  public checkedOutCount = computed(() => this.visitors().filter(v => v.status === 'Out').length);

  openPreApproveModal() {
    const user = this.authService?.currentUser();
    this.visitorForm = {
      name: '',
      phone: '',
      purpose: 'Guest',
      hostResident: user?.name || 'Resident Member',
      flatNumber: user?.flat || 'A-101',
      vehicleNumber: ''
    };
    this.showPreApproveModal.set(true);
  }

  closePreApproveModal() {
    this.showPreApproveModal.set(false);
  }

  savePreApproval() {
    if (!this.visitorForm.name || !this.visitorForm.phone) return;
    this.mockData.addVisitor({
      name: this.visitorForm.name,
      phone: this.visitorForm.phone,
      purpose: this.visitorForm.purpose,
      hostResident: this.visitorForm.hostResident,
      flatNumber: this.visitorForm.flatNumber,
      vehicleNumber: this.visitorForm.vehicleNumber
    });
    this.closePreApproveModal();
  }

  checkOutVisitor(v: Visitor) {
    this.mockData.checkoutVisitor(v.id);
  }
}
