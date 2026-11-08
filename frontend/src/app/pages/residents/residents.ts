import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MockDataService } from '../../services/mock-data.service';
import { Resident } from '../../models/models';

@Component({
  selector: 'app-residents-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './residents.html',
  styleUrl: './residents.css'
})
export class ResidentsPageComponent {
  public mockData = inject(MockDataService);

  public residents = this.mockData.residents;
  public searchQuery = signal<string>('');
  public selectedType = signal<string>('ALL');
  public selectedStatus = signal<string>('ALL');
  public selectedBuilding = signal<string>('ALL');

  // Modals
  public showAddModal = signal<boolean>(false);
  public showDetailDrawer = signal<boolean>(false);
  public selectedResident = signal<Resident | null>(null);

  // Form
  public residentForm: any = {
    name: '',
    email: '',
    phone: '',
    flatNumber: 'A-102',
    building: 'Block A',
    type: 'Owner' as 'Owner' | 'Tenant',
    status: 'Active' as 'Active' | 'Pending' | 'Inactive',
    joinDate: new Date().toISOString().split('T')[0]
  };

  // Filtered residents
  public filteredResidents = computed(() => {
    let list = this.residents();
    const q = this.searchQuery().toLowerCase().trim();
    const type = this.selectedType();
    const status = this.selectedStatus();
    const bldg = this.selectedBuilding();

    if (q) {
      list = list.filter(r =>
        r.name.toLowerCase().includes(q) ||
        r.flatNumber.toLowerCase().includes(q) ||
        r.email.toLowerCase().includes(q) ||
        r.phone.toLowerCase().includes(q)
      );
    }
    if (type !== 'ALL') list = list.filter(r => r.type === type);
    if (status !== 'ALL') list = list.filter(r => r.status === status);
    if (bldg !== 'ALL') list = list.filter(r => r.building === bldg);
    return list;
  });

  // KPIs
  public totalCount = computed(() => this.residents().length);
  public ownerCount = computed(() => this.residents().filter(r => r.type === 'Owner').length);
  public tenantCount = computed(() => this.residents().filter(r => r.type === 'Tenant').length);
  public pendingCount = computed(() => this.residents().filter(r => r.status === 'Pending').length);

  // Actions
  openAddModal() {
    this.residentForm = {
      name: '',
      email: '',
      phone: '',
      flatNumber: 'A-102',
      building: 'Block A',
      type: 'Owner',
      status: 'Active',
      joinDate: new Date().toISOString().split('T')[0]
    };
    this.showAddModal.set(true);
  }

  closeAddModal() {
    this.showAddModal.set(false);
  }

  saveResident() {
    if (!this.residentForm.name || !this.residentForm.phone) return;
    this.mockData.addResident({
      name: this.residentForm.name,
      email: this.residentForm.email || `${this.residentForm.name.toLowerCase().replace(' ', '.')}@email.com`,
      phone: this.residentForm.phone,
      flatNumber: this.residentForm.flatNumber,
      building: this.residentForm.building,
      type: this.residentForm.type,
      status: this.residentForm.status
    });
    this.closeAddModal();
  }

  approveResident(r: Resident, event?: MouseEvent) {
    if (event) event.stopPropagation();
    this.mockData.approveResident(r.id);
  }

  viewDetails(r: Resident) {
    this.selectedResident.set(r);
    this.showDetailDrawer.set(true);
  }

  closeDrawer() {
    this.showDetailDrawer.set(false);
  }

  deleteResident(r: Resident, event?: MouseEvent) {
    if (event) event.stopPropagation();
    if (confirm(`Remove ${r.name} from society resident records?`)) {
      this.mockData.deleteResident(r.id);
      if (this.showDetailDrawer()) this.closeDrawer();
    }
  }
}
