import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MockDataService } from '../../services/mock-data.service';
import { Flat } from '../../models/models';

interface Tower {
  id: string;
  name: string;
  floors: number;
  totalFlats: number;
  occupied: number;
}

@Component({
  selector: 'app-buildings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './buildings.html',
  styleUrl: './buildings.css'
})
export class BuildingsComponent implements OnInit {
  // Service injection for live state
  public mockData = inject(MockDataService);

  public flats = this.mockData.flats;
  get towers(): Tower[] {
    const list = this.flats();
    const map = new Map<string, { total: number; occupied: number }>();
    list.forEach(f => {
      const b = f.building || 'Block A';
      if (!map.has(b)) map.set(b, { total: 0, occupied: 0 });
      const stats = map.get(b)!;
      stats.total++;
      if (f.status === 'Occupied') stats.occupied++;
    });

    if (map.size === 0) {
      return [
        { id: 'Block A', name: 'Tower A - Palm Grove', floors: 12, totalFlats: 0, occupied: 0 },
        { id: 'Block B', name: 'Tower B - Cedar Woods', floors: 12, totalFlats: 0, occupied: 0 },
        { id: 'Block C', name: 'Tower C - Pine Crest', floors: 10, totalFlats: 0, occupied: 0 },
        { id: 'Block D', name: 'Tower D - Maple Court', floors: 10, totalFlats: 0, occupied: 0 }
      ];
    }

    return Array.from(map.entries()).map(([name, stats]) => ({
      id: name,
      name: name,
      floors: Math.max(1, Math.ceil(stats.total / 4)),
      totalFlats: stats.total,
      occupied: stats.occupied
    }));
  }

  public selectedTower = signal<string>('ALL');
  public selectedType = signal<string>('ALL');
  public selectedStatus = signal<string>('ALL');
  public searchQuery = signal<string>('');
  public viewMode = signal<'grid' | 'table'>('grid');

  // Modals
  public showAddFlatModal = signal<boolean>(false);
  public showAddTowerModal = signal<boolean>(false);
  public showDrawer = signal<boolean>(false);
  public activeFlat = signal<Flat | null>(null);

  // Forms
  public flatForm: any = {
    number: '',
    building: 'Block A',
    floor: 1,
    type: '2BHK',
    status: 'Occupied',
    area: 1250,
    resident: '',
    parkingSlot: 'B1-Slot-12',
    phone: '+91 98220 12345'
  };

  public towerForm = {
    name: '',
    floors: 10,
    totalFlats: 40,
    description: ''
  };

  ngOnInit() {}

  // Filtered flats
  public filteredFlats = computed(() => {
    let list = this.flats();
    const tower = this.selectedTower();
    const type = this.selectedType();
    const status = this.selectedStatus();
    const q = this.searchQuery().toLowerCase().trim();

    if (tower !== 'ALL') list = list.filter(f => f.building === tower);
    if (type !== 'ALL') list = list.filter(f => f.type === type);
    if (status !== 'ALL') list = list.filter(f => f.status === status);
    if (q) {
      list = list.filter(f =>
        f.number.toLowerCase().includes(q) ||
        (f.resident && f.resident.toLowerCase().includes(q)) ||
        (f.parkingSlot && f.parkingSlot.toLowerCase().includes(q))
      );
    }
    return list;
  });

  // Grouped by floor
  public floorsList = computed(() => {
    const list = this.filteredFlats();
    const map = new Map<number, Flat[]>();
    list.forEach(f => {
      if (!map.has(f.floor)) map.set(f.floor, []);
      map.get(f.floor)!.push(f);
    });

    const floorsDesc = Array.from(map.keys()).sort((a, b) => b - a);
    return floorsDesc.map(fl => ({
      floorNumber: fl,
      flats: map.get(fl)!.sort((a, b) => a.number.localeCompare(b.number))
    }));
  });

  // Counters
  public totalFlatsCount = computed(() => this.flats().length);
  public occupiedCount = computed(() => this.flats().filter(f => f.status === 'Occupied').length);
  public vacantCount = computed(() => this.flats().filter(f => f.status === 'Vacant').length);
  public maintenanceCount = computed(() => this.flats().filter(f => f.status === 'Under Maintenance').length);

  // Actions
  openAddFlatModal() {
    this.flatForm = {
      number: '',
      building: this.selectedTower() !== 'ALL' ? this.selectedTower() : 'Block A',
      floor: 1,
      type: '2BHK',
      status: 'Occupied',
      area: 1250,
      resident: '',
      parkingSlot: 'B1-Slot-22',
      phone: '+91 98220 54321'
    };
    this.showAddFlatModal.set(true);
  }

  closeAddFlatModal() {
    this.showAddFlatModal.set(false);
  }

  saveNewFlat() {
    if (!this.flatForm.number) return;
    this.mockData.addFlat({
      number: this.flatForm.number,
      building: this.flatForm.building,
      floor: Number(this.flatForm.floor),
      type: this.flatForm.type,
      status: this.flatForm.status,
      resident: this.flatForm.resident,
      area: Number(this.flatForm.area)
    });
    this.closeAddFlatModal();
  }

  openAddTowerModal() {
    this.showAddTowerModal.set(true);
  }

  closeAddTowerModal() {
    this.showAddTowerModal.set(false);
  }

  saveNewTower() {
    if (!this.towerForm.name) return;
    this.mockData.showToast({
      type: 'success',
      title: 'Tower Added',
      message: `${this.towerForm.name} registered into society master plan.`
    });
    this.closeAddTowerModal();
  }

  viewDetails(flat: Flat) {
    this.activeFlat.set(flat);
    this.showDrawer.set(true);
  }

  closeDrawer() {
    this.showDrawer.set(false);
  }

  quickStatus(status: 'Occupied' | 'Vacant' | 'Under Maintenance') {
    const current = this.activeFlat();
    if (!current) return;
    this.mockData.updateFlatStatus(current.id, status);
    this.activeFlat.set({ ...current, status });
  }

  deleteFlat(flat: Flat, event?: MouseEvent) {
    if (event) event.stopPropagation();
    if (confirm(`Remove Flat ${flat.number} from society records?`)) {
      this.mockData.deleteFlat(flat.id);
      if (this.showDrawer()) this.closeDrawer();
    }
  }
}
