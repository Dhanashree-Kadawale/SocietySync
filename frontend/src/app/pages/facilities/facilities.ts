import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MockDataService } from '../../services/mock-data.service';
import { Facility, FacilityBooking } from '../../models/models';

@Component({
  selector: 'app-facilities-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './facilities.html',
  styleUrl: './facilities.css'
})
export class FacilitiesPageComponent implements OnInit {
  public mockData = inject(MockDataService);

  public facilities = signal<Facility[]>([]);
  public bookings = signal<FacilityBooking[]>([]);

  public selectedFacility = signal<string>('ALL');
  public selectedStatus = signal<string>('ALL');
  public searchQuery = signal<string>('');

  // Modals
  public showBookModal = signal<boolean>(false);

  public bookingForm = {
    facilityName: 'Clubhouse',
    residentName: 'Priya Sharma',
    flatNumber: 'A-204',
    date: '2026-10-25',
    startTime: '05:00 PM',
    endTime: '09:00 PM',
    amount: 8000,
    purpose: 'Family Get-Together'
  };

  ngOnInit() {
    this.facilities.set(this.mockData.getFacilities());
    this.bookings.set(this.mockData.getFacilityBookings());
  }

  public filteredBookings = computed(() => {
    let list = this.bookings();
    const fac = this.selectedFacility();
    const status = this.selectedStatus();
    const q = this.searchQuery().toLowerCase().trim();

    if (fac !== 'ALL') list = list.filter(b => b.facilityName === fac);
    if (status !== 'ALL') list = list.filter(b => b.status === status);
    if (q) {
      list = list.filter(b =>
        b.residentName.toLowerCase().includes(q) ||
        b.flatNumber.toLowerCase().includes(q) ||
        b.purpose.toLowerCase().includes(q)
      );
    }
    return list;
  });

  // KPIs
  public totalFacilities = computed(() => this.facilities().length);
  public totalBookingsCount = computed(() => this.bookings().length);
  public confirmedBookingsCount = computed(() => this.bookings().filter(b => b.status === 'Confirmed').length);
  public pendingBookingsCount = computed(() => this.bookings().filter(b => b.status === 'Pending').length);

  // Actions
  openBookModal(facName?: string) {
    if (facName) this.bookingForm.facilityName = facName;
    this.showBookModal.set(true);
  }

  closeBookModal() {
    this.showBookModal.set(false);
  }

  saveBooking() {
    const newBkg: FacilityBooking = {
      id: `BKG-00${this.bookings().length + 1}`,
      facilityId: 'FAC-001',
      facilityName: this.bookingForm.facilityName,
      residentName: this.bookingForm.residentName,
      flatNumber: this.bookingForm.flatNumber,
      date: this.bookingForm.date,
      startTime: this.bookingForm.startTime,
      endTime: this.bookingForm.endTime,
      amount: this.bookingForm.amount,
      status: 'Confirmed',
      purpose: this.bookingForm.purpose
    };

    this.bookings.update(prev => [newBkg, ...prev]);
    this.mockData.showToast({
      type: 'success',
      title: 'Facility Reserved',
      message: `${newBkg.facilityName} booked for ${newBkg.residentName} on ${newBkg.date}.`
    });
    this.closeBookModal();
  }

  confirmBooking(b: FacilityBooking) {
    this.bookings.update(prev =>
      prev.map(item => item.id === b.id ? { ...item, status: 'Confirmed' } : item)
    );
    this.mockData.showToast({
      type: 'success',
      title: 'Booking Confirmed',
      message: `Reservation #${b.id} marked as Confirmed.`
    });
  }

  cancelBooking(b: FacilityBooking) {
    this.bookings.update(prev =>
      prev.map(item => item.id === b.id ? { ...item, status: 'Cancelled' } : item)
    );
    this.mockData.showToast({
      type: 'info',
      title: 'Booking Cancelled',
      message: `Reservation #${b.id} has been cancelled.`
    });
  }
}
