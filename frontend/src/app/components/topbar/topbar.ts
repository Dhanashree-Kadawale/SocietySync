import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MockDataService } from '../../services/mock-data.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './topbar.html',
  styleUrl: './topbar.css'
})
export class Topbar implements OnInit {
  @Input() sidebarCollapsed = false;
  @Input() breadcrumb = 'Dashboard';
  @Output() toggleSidebar = new EventEmitter<void>();

  currentDate = '';
  searchQuery = '';
  showNotifications = false;
  showProfileMenu = false;
  showCreateMenu = false;

  notifications = [
    { id: 1, icon: 'alert', text: 'New complaint filed by Ananya Sharma (A-201)', time: '5m ago', unread: true, color: '#DC4545' },
    { id: 2, icon: 'check', text: 'Maintenance payment of ₹4,200 received from Priya Patel', time: '32m ago', unread: true, color: '#1D5245' },
    { id: 3, icon: 'calendar', text: 'Clubhouse booking confirmed for Oct 20', time: '1h ago', unread: true, color: '#17453A' },
    { id: 4, icon: 'user', text: '2 new resident approvals pending in Tower A', time: '2h ago', unread: false, color: '#F9CE60' },
    { id: 5, icon: 'bell', text: 'Water pipeline maintenance notice published', time: '3h ago', unread: false, color: '#71948F' },
  ];

  unreadCount = 3;

  constructor(
    public mockData: MockDataService,
    public authService: AuthService,
    private router: Router
  ) {}

  get displayedBreadcrumb(): string {
    const active = this.mockData.activeSection();
    const found = this.mockData.getNavItems().find(n => n.id === active);
    return found ? found.label : (this.breadcrumb || 'Dashboard');
  }

  get userInitials(): string {
    const name = this.authService.currentUser()?.name || 'Admin';
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  }

  get userName(): string {
    return this.authService.currentUser()?.name || 'Secretary Admin';
  }

  get userShortName(): string {
    const parts = (this.authService.currentUser()?.name || 'Secretary').trim().split(/\s+/);
    return parts.length > 1 ? `${parts[0]} ${parts[1][0]}.` : parts[0];
  }

  get userEmail(): string {
    return this.authService.currentUser()?.email || 'secretary@societysync.com';
  }

  get userRole(): string {
    return this.authService.currentUser()?.role || 'Secretary Admin';
  }

  get societyName(): string {
    return this.authService.currentUser()?.societyName || 'SocietySync Community';
  }

  ngOnInit() {
    const now = new Date();
    this.currentDate = now.toLocaleDateString('en-IN', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  }

  onToggleSidebar() {
    this.toggleSidebar.emit();
  }

  navigate(route: string) {
    this.closeAll();
    this.router.navigate([route]);
  }

  toggleNotifications(event: Event) {
    event.stopPropagation();
    this.showNotifications = !this.showNotifications;
    this.showProfileMenu = false;
    this.showCreateMenu = false;
  }

  toggleProfileMenu(event: Event) {
    event.stopPropagation();
    this.showProfileMenu = !this.showProfileMenu;
    this.showNotifications = false;
    this.showCreateMenu = false;
  }

  closeAll() {
    this.showNotifications = false;
    this.showProfileMenu = false;
    this.showCreateMenu = false;
  }

  markAllRead() {
    this.notifications.forEach(n => n.unread = false);
    this.unreadCount = 0;
  }

  onSignOut() {
    this.closeAll();
    this.mockData.showToast({
      type: 'info',
      title: 'Signed Out',
      message: 'You have been signed out successfully.',
    });
    this.authService.logout();
  }

  onSearch() {
    const q = this.searchQuery.trim();
    if (!q) return;
    this.closeAll();
    this.mockData.showToast({
      type: 'info',
      title: 'Search',
      message: `Searching records for "${q}"...`,
    });
    this.router.navigate(['/complaints']);
  }
}
