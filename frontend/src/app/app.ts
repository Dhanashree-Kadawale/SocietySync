import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router } from '@angular/router';
import { Sidebar } from './components/sidebar/sidebar';
import { Topbar } from './components/topbar/topbar';
import { ToastComponent } from './components/toast/toast';
import { MockDataService } from './services/mock-data.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    Sidebar,
    Topbar,
    ToastComponent
  ],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  isSidebarCollapsed = false;
  isMobileSidebarOpen = false;

  constructor(
    public mockData: MockDataService,
    private router: Router
  ) {}

  get isAuthPage(): boolean {
    const path = this.router.url.split('?')[0].split('#')[0];
    const standalone = [
      '',
      '/',
      '/home',
      '/login',
      '/register',
      '/super-admin-login',
      '/super-admin',
      '/super-admin-dashboard',
      '/resident',
      '/resident-dashboard',
      '/staff-dashboard'
    ];
    return standalone.includes(path) || path.includes('/login');
  }

  toggleSidebar() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }

  toggleMobileSidebar() {
    this.isMobileSidebarOpen = !this.isMobileSidebarOpen;
  }

  handleTopbarSidebarToggle() {
    if (typeof window !== 'undefined' && window.innerWidth <= 768) {
      this.isMobileSidebarOpen = !this.isMobileSidebarOpen;
    } else {
      this.isSidebarCollapsed = !this.isSidebarCollapsed;
    }
  }

  closeMobileSidebar() {
    this.isMobileSidebarOpen = false;
  }

  onSelectNav(sectionId: string) {
    this.isMobileSidebarOpen = false;
  }
}
