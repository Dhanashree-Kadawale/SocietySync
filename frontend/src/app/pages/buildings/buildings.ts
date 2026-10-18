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
  // Service injection for mock state
  public mockData = inject(MockDataService);

  public flats = signal<Flat[]>([]);
  public towers: Tower[] = [
    { id: 'Block A', name: 'Tower A - Palm Grove', floors: 12, totalFlats: 60, occupied: 54 },
    { id: 'Block B', name: 'Tower B - Cedar Woods', floors: 12, totalFlats: 60, occupied: 52 },
    { id: 'Block C', name: 'Tower C - Pine Crest', floors: 10, totalFlats: 60, occupied: 55 },
    { id: 'Block D', name: 'Tower D - Maple Court', floors: 10, totalFlats: 60, occupied: 57 }
  ];

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

  ngOnInit() {
    // Generate realistic flats for all 4 towers
    const allFlats: Flat[] = [];
    const residents = [
      'Priya Sharma', 'Sunil Verma', 'Ananya Mehta', 'Rohan Gupta',
      'Kavita Nair', 'Deepak Joshi', 'Vikram Malhotra', 'Sneha Kulkarni'
    ];

    ['Block A', 'Block B', 'Block C', 'Block D'].forEach((tower, tIdx) => {
      const prefix = ['A', 'B', 'C', 'D'][tIdx];
      for (let floor = 1; floor <= 6; floor++) {
        for (let unit = 1; unit <= 4; unit++) {
          const flatNum = `${prefix}-${floor * 100 + unit}`;
          const isMaint = (floor + unit) % 9 === 0;
          const isVacant = !isMaint && (floor + unit) % 5 === 0;
          const status = isMaint ? 'Under Maintenance' : isVacant ? 'Vacant' : 'Occupied';
          const type = unit === 1 ? '1BHK' : unit === 2 ? '2BHK' : unit === 3 ? '3BHK' : '4BHK';
          const res = status === 'Occupied' ? residents[(floor + unit + tIdx) % residents.length] : undefined;

          allFlats.push({
            id: `F-${flatNum}`,
            number: flatNum,
            flatNumber: flatNum,
            building: tower,
            floor: floor,
            type: type,
            status: status,
            resident: res,
            area: type === '1BHK' ? 650 : type === '2BHK' ? 950 : type === '3BHK' ? 1450 : 1850,
            parkingSlot: `B${(floor % 2) + 1}-Slot-${floor * 4 + unit}`,
            ownerPhone: '+91 98220 ' + (10000 + floor * 100 + unit),
            intercomNumber: `4${floor}${unit}`
          });
        }
      }
    });

    this.flats.set(allFlats);
  }

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
    const newFlat: Flat = {
      id: `F-${this.flatForm.number}`,
      number: this.flatForm.number,
      flatNumber: this.flatForm.number,
      building: this.flatForm.building,
      floor: Number(this.flatForm.floor),
      type: this.flatForm.type,
      status: this.flatForm.status,
      resident: this.flatForm.resident,
      area: Number(this.flatForm.area),
      parkingSlot: this.flatForm.parkingSlot,
      ownerPhone: this.flatForm.phone,
      intercomNumber: `4${this.flatForm.number.replace(/\D/g, '')}`
    };

    this.flats.update(prev => [newFlat, ...prev]);
    this.mockData.showToast({
      type: 'success',
      title: 'Flat Registered',
      message: `Flat ${newFlat.number} added to ${newFlat.building}.`
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
    this.towers.push({
      id: `Block ${this.towerForm.name.slice(-1)}`,
      name: this.towerForm.name,
      floors: this.towerForm.floors,
      totalFlats: this.towerForm.totalFlats,
      occupied: 0
    });
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
    this.flats.update(prev =>
      prev.map(f => f.id === current.id ? { ...f, status } : f)
    );
    this.activeFlat.set({ ...current, status });
    this.mockData.showToast({
      type: 'info',
      title: 'Status Updated',
      message: `Flat ${current.number} status changed to ${status}.`
    });
  }

  deleteFlat(flat: Flat, event?: MouseEvent) {
    if (event) event.stopPropagation();
    if (confirm(`Remove Flat ${flat.number} from society records?`)) {
      this.flats.update(prev => prev.filter(f => f.id !== flat.id));
      if (this.showDrawer()) this.closeDrawer();
      this.mockData.showToast({
        type: 'info',
        title: 'Flat Deleted',
        message: `Flat ${flat.number} deleted successfully.`
      });
    }
  }
}
