import { Component, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MockDataService } from '../../services/mock-data.service';
import { AuthService } from '../../services/auth.service';
import { StatCard } from '../../models/models';
import { MaintenanceChartComponent } from '../../components/maintenance-chart/maintenance-chart';
import { ComplaintChartComponent } from '../../components/complaint-chart/complaint-chart';
import { ComplaintsTableComponent } from '../../components/complaints-table/complaints-table';
import { ActivityFeedComponent } from '../../components/activity-feed/activity-feed';
import { PendingActionsComponent } from '../../components/pending-actions/pending-actions';
import { FacilityBookingsComponent } from '../../components/facility-bookings/facility-bookings';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MaintenanceChartComponent,
    ComplaintChartComponent,
    ComplaintsTableComponent,
    ActivityFeedComponent,
    PendingActionsComponent,
    FacilityBookingsComponent,
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class DashboardComponent implements OnInit {
  statCards: StatCard[] = [];
  showCreateMenu = false;
  greeting = 'Welcome back';

  readonly secretaryUser = computed(() => this.authService.currentUser());
  readonly secretaryName = computed(() => this.secretaryUser()?.name || 'Rajesh Mehta');
  readonly societyName = computed(() => this.secretaryUser()?.societyName || 'Greenwood Heights');
  readonly userRole = computed(() => this.secretaryUser()?.role || 'Secretary Admin');
  readonly secretaryFlat = computed(() => this.secretaryUser()?.flat || 'B-401');

  readonly todayDateString = computed(() => {
    const now = new Date();
    return now.toLocaleDateString('en-IN', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).toUpperCase();
  });

  createOptions = [
    { label: 'New Notice', icon: '📢', action: 'notice' },
    { label: 'New Complaint', icon: '⚠️', action: 'complaint' },
    { label: 'New Maintenance Bill', icon: '📄', action: 'bill' },
    { label: 'New Expense', icon: '💰', action: 'expense' },
    { label: 'Facility Booking', icon: '🏛️', action: 'booking' },
    { label: 'Add Resident', icon: '👤', action: 'resident' },
  ];

  notices = [
    {
      day: '18',
      month: 'OCT',
      title: 'Scheduled Water Supply Pipeline Maintenance',
      description: 'Water supply to Tower A and Tower B will experience low pressure between 10:00 AM and 01:00 PM due to preventive valve servicing on the terrace booster pumps.',
      tags: [
        { label: 'Maintenance', type: 'info' },
        { label: 'High Priority', type: 'danger' }
      ]
    },
    {
      day: '29',
      month: 'OCT',
      title: 'Annual Diwali Celebration & Cultural Evening',
      description: 'The society managing committee cordially invites all families to the Grand Diwali Celebration in the main clubhouse courtyard at 7:00 PM.',
      tags: [
        { label: 'Celebration', type: 'warning' },
        { label: 'Society Event', type: 'success' }
      ]
    }
  ];

  get activeSocietyDetails() {
    const user = this.secretaryUser();
    const flat = user?.flat || 'B-401';
    const soc = user?.societyName || 'Greenwood Heights';
    const role = user?.role || 'Secretary Admin';
    return [
      { label: 'Flat & Office:', value: `${flat} · Managing Office`, badge: `${role} Verified` },
      { label: 'Society & Towers:', value: `${soc} (Towers A, B, C, D)`, badge: null },
      { label: 'Carpet Area:', value: '1,450 sq.ft (3 BHK Luxury Unit)', badge: null },
      { label: 'Dedicated Parking:', value: 'B1-Slot-42 (Covered Basement)', badge: null },
      { label: 'Primary Vehicle:', value: 'MH 12 AB 4589 (Honda City)', badge: null },
      { label: 'Security & Staff:', value: 'Gate 1 (Intercom 4001) · 12 On Duty', badge: null },
    ];
  }

  // Fallback for any legacy template bindings
  get societyDetails() {
    return this.activeSocietyDetails;
  }

  constructor(
    public mockData: MockDataService,
    public authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.statCards = this.mockData.getStatCards();
    const hour = new Date().getHours();
    if (hour < 12) this.greeting = 'Welcome home';
    else if (hour < 17) this.greeting = 'Welcome back';
    else this.greeting = 'Good evening';
  }

  toggleCreateMenu(e: Event) {
    e.stopPropagation();
    this.showCreateMenu = !this.showCreateMenu;
  }

  navigateTo(route: string) {
    this.closeMenu();
    this.router.navigate([route]);
  }

  handleCreate(action: string, label: string) {
    this.showCreateMenu = false;
    const routeMap: Record<string, string> = {
      notice: '/notices',
      complaint: '/complaints',
      bill: '/billing',
      expense: '/expenses',
      booking: '/facilities',
      resident: '/residents',
    };
    const target = routeMap[action] || '/dashboard';
    this.mockData.showToast({
      type: 'info',
      title: label,
      message: `Opening ${label}...`,
    });
    this.router.navigate([target]);
  }

  closeMenu() {
    this.showCreateMenu = false;
  }
}
