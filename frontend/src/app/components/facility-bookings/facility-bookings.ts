import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MockDataService } from '../../services/mock-data.service';
import { FacilityBooking } from '../../models/models';

@Component({
  selector: 'app-facility-bookings',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './facility-bookings.html',
  styleUrl: './facility-bookings.css'
})
export class FacilityBookingsComponent implements OnInit {
  bookings: FacilityBooking[] = [];

  facilityEmojis: Record<string, string> = {
    'Clubhouse': '🏛️',
    'Swimming Pool': '🏊',
    'Gymnasium': '💪',
    'Tennis Court': '🎾',
    'Badminton Court': '🏸',
  };

  facilityColors: Record<string, string> = {
    'Clubhouse': '#17453A',
    'Swimming Pool': '#71948F',
    'Gymnasium': '#1D5245',
    'Tennis Court': '#F9CE60',
    'Badminton Court': '#DC4545',
  };

  constructor(private mockData: MockDataService) {}

  ngOnInit() {
    this.bookings = this.mockData.getFacilityBookings();
  }

  getStatusClass(status: string): string {
    const map: Record<string, string> = {
      'Confirmed': 'badge-success',
      'Pending': 'badge-warning',
      'Cancelled': 'badge-error',
    };
    return map[status] || 'badge-grey';
  }

  formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
  }

  confirmBooking(booking: FacilityBooking) {
    booking.status = 'Confirmed';
    this.mockData.showToast({
      type: 'success',
      title: 'Booking Confirmed',
      message: `${booking.facilityName} booking by ${booking.residentName} confirmed`,
    });
  }
}
