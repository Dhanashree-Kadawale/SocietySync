import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MockDataService } from '../../services/mock-data.service';
import { Visitor } from '../../models/models';

@Component({
  selector: 'app-visitors-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './visitors.html',
  styleUrl: './visitors.css'
})
export class VisitorsPageComponent implements OnInit {
  public mockData = inject(MockDataService);

  public visitors = signal<Visitor[]>([]);
  public searchQuery = signal<string>('');
  public selectedStatus = signal<string>('ALL');

  public showPreApproveModal = signal<boolean>(false);

  public visitorForm = {
    name: '',
    phone: '',
    purpose: 'Guest',
    hostResident: 'Rahul Verma',
    flatNumber: 'A-204',
    vehicleNumber: 'MH 12 CD 3456'
  };

  ngOnInit() {
    this.visitors.set(this.mockData.getVisitors());
  }

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
    this.visitorForm = {
      name: '',
      phone: '',
      purpose: 'Guest',
      hostResident: 'Rahul Verma',
      flatNumber: 'A-204',
      vehicleNumber: ''
    };
    this.showPreApproveModal.set(true);
  }

  closePreApproveModal() {
    this.showPreApproveModal.set(false);
  }

  savePreApproval() {
    if (!this.visitorForm.name || !this.visitorForm.phone) return;
    const newVis: Visitor = {
      id: `VIS-00${this.visitors().length + 1}`,
      name: this.visitorForm.name,
      phone: this.visitorForm.phone,
      purpose: this.visitorForm.purpose,
      hostResident: this.visitorForm.hostResident,
      flatNumber: this.visitorForm.flatNumber,
      checkIn: new Date().toISOString(),
      vehicleNumber: this.visitorForm.vehicleNumber,
      status: 'In'
    };

    this.visitors.update(prev => [newVis, ...prev]);
    this.mockData.showToast({
      type: 'success',
      title: 'Gate Pass Issued',
      message: `Visitor pass issued for ${newVis.name} visiting ${newVis.flatNumber}.`
    });
    this.closePreApproveModal();
  }

  checkOutVisitor(v: Visitor) {
    this.visitors.update(prev =>
      prev.map(item => item.id === v.id ? { ...item, status: 'Out', checkOut: new Date().toISOString() } : item)
    );
    this.mockData.showToast({
      type: 'info',
      title: 'Visitor Checked Out',
      message: `${v.name} departure logged at Main Gate.`
    });
  }
}
