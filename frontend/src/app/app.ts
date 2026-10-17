import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
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

  constructor(public mockData: MockDataService) {}

  toggleSidebar() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }

  toggleMobileSidebar() {
    this.isMobileSidebarOpen = !this.isMobileSidebarOpen;
  }

  closeMobileSidebar() {
    this.isMobileSidebarOpen = false;
  }

  onSelectNav(sectionId: string) {
    this.isMobileSidebarOpen = false;
  }
}
