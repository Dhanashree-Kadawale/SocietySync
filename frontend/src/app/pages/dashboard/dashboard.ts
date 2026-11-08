import { Component, OnInit } from '@angular/core';
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
  get statCards(): StatCard[] {
    return this.mockData.getStatCards();
  }
  showCreateMenu = false;
  greeting = 'Welcome back';

  createOptions = [
    { label: 'New Notice', icon: '📢', action: 'notice' },
    { label: 'New Complaint', icon: '⚠️', action: 'complaint' },
    { label: 'New Maintenance Bill', icon: '📄', action: 'bill' },
    { label: 'New Expense', icon: '💰', action: 'expense' },
    { label: 'Facility Booking', icon: '🏛️', action: 'booking' },
    { label: 'Add Resident', icon: '👤', action: 'resident' },
  ];

  get notices() {
    const list = this.mockData.notices();
    return list.map(n => {
      const d = n.postedAt ? new Date(n.postedAt) : new Date();
      return {
        day: String(d.getDate()).padStart(2, '0'),
        month: d.toLocaleString('en-US', { month: 'short' }).toUpperCase(),
        title: n.title,
        description: n.content,
        tags: [
          { label: n.type || 'Notice', type: n.type === 'Urgent' ? 'danger' : 'info' }
        ]
      };
    });
  }

  get userName(): string {
    return this.authService.currentUser()?.name || 'Secretary Admin';
  }

  get userRole(): string {
    return this.authService.currentUser()?.role || 'Secretary Admin';
  }

  get societyName(): string {
    return this.authService.currentUser()?.societyName || 'Green Heights Co-op Society';
  }

  get userFlat(): string {
    return this.authService.currentUser()?.flat || 'A-101';
  }

  get societyDetails() {
    const user = this.authService.currentUser();
    return [
      { label: 'Flat & Tower:', value: `${user?.flat || 'A-101'} (Tower A · ${user?.societyName || 'Green Heights'})`, badge: 'Active Account' },
      { label: 'Society & Towers:', value: `${user?.societyName || 'Green Heights'} (Tower A, B, C)`, badge: null },
      { label: 'Primary Contact:', value: `${user?.email || 'admin@societysync.com'} · ${user?.phone || '+91 98000 00000'}`, badge: null },
      { label: 'Dedicated Parking:', value: 'B1-Slot-42 (Covered Basement)', badge: null },
      { label: 'Role & Permissions:', value: `${user?.role || 'Secretary Admin'} (Full Administrative Access)`, badge: null },
      { label: 'Security & Staff:', value: 'Gate 1 (Intercom 4001) · 12 On Duty', badge: null },
    ];
  }

  constructor(
    public mockData: MockDataService,
    public authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
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
