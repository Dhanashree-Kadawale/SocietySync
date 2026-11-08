import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { MockDataService } from '../../services/mock-data.service';
import { AuthService } from '../../services/auth.service';
import { NavItem } from '../../models/models';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css'
})
export class Sidebar implements OnInit {
  @Input() collapsed = false;
  @Input() mobileOpen = false;
  @Output() toggleCollapse = new EventEmitter<void>();
  @Output() navSelect = new EventEmitter<string>();

  mainServices: NavItem[] = [];
  communityItems: NavItem[] = [];
  activeRoute = 'dashboard';

  constructor(
    private mockData: MockDataService,
    public authService: AuthService,
    private router: Router
  ) { }

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

  get userRole(): string {
    return this.authService.currentUser()?.role || 'Secretary';
  }

  get societyName(): string {
    return this.authService.currentUser()?.societyName || 'SocietySync Community';
  }

  get userFlat(): string {
    return this.authService.currentUser()?.flat || 'Tower A · Office';
  }

  ngOnInit() {
    this.mainServices = this.mockData.getMainNavItems();
    this.communityItems = this.mockData.getCommunityNavItems();

    this.updateActiveFromUrl(this.router.url);
    this.router.events.pipe(
      filter(e => e instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.updateActiveFromUrl(event.urlAfterRedirects || event.url);
    });
  }

  private updateActiveFromUrl(url: string) {
    const cleanUrl = url.replace(/^\//, '').split('?')[0].split('#')[0] || 'dashboard';
    this.activeRoute = cleanUrl;
    this.mockData.setActiveSection(cleanUrl);
  }

  setActive(item: NavItem | string) {
    if (typeof item === 'string') {
      const found = this.mockData.getNavItems().find(n => n.id === item);
      if (found) {
        this.activeRoute = found.id;
        this.mockData.setActiveSection(found.id);
        this.router.navigate([found.route]);
        this.navSelect.emit(found.id);
      } else {
        this.activeRoute = item;
        this.mockData.setActiveSection(item);
        this.router.navigate(['/' + item]);
        this.navSelect.emit(item);
      }
    } else {
      this.activeRoute = item.id;
      this.mockData.setActiveSection(item.id);
      this.router.navigate([item.route]);
      this.navSelect.emit(item.id);
    }
  }

  toggle() {
    this.toggleCollapse.emit();
  }

  onSignOut() {
    this.mockData.showToast({
      type: 'info',
      title: 'Signed Out',
      message: 'You have been signed out successfully.',
    });
    this.authService.logout();
  }

  onProfileClick() {
    this.router.navigate(['/settings']);
  }

  getNavIcon(icon: string): string {
    return icon;
  }
}
