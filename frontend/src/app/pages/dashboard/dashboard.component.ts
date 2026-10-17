import { Component, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  activePage = 'Dashboard';
  searchText = '';

  currentUser = computed(() => this.authService.currentUser());

  navItems = [
    { name: 'Dashboard', icon: '▦' },
    { name: 'Residents', icon: '♙' },
    { name: 'Announcements', icon: '▤' },
    { name: 'Events', icon: '◷' },
    { name: 'Complaints', icon: '▧' }
  ];

  stats = [
    { label: 'Total Residents', value: '248', change: '+12 this month', icon: '♙', color: 'blue' },
    { label: 'Announcements', value: '12', change: '3 new this week', icon: '▤', color: 'purple' },
    { label: 'Upcoming Events', value: '4', change: 'Next: Community Meetup', icon: '◷', color: 'orange' },
    { label: 'Open Complaints', value: '08', change: '2 resolved this week', icon: '▧', color: 'green' }
  ];

  activities = [
    { title: 'New resident registered', detail: 'Flat A-204 · Priya Sharma', time: '10 min ago', icon: '♙', color: 'blue' },
    { title: 'New announcement published', detail: 'Water supply maintenance', time: '1 hour ago', icon: '▤', color: 'purple' },
    { title: 'Complaint resolved', detail: 'Flat B-105 · Lift maintenance', time: '3 hours ago', icon: '✓', color: 'green' },
    { title: 'Community event scheduled', detail: 'Weekend gathering', time: 'Yesterday', icon: '◷', color: 'orange' }
  ];

  residents = [
    { name: 'Priya Sharma', flat: 'A-204', phone: '98765 43210', role: 'Resident', status: 'Active' },
    { name: 'Rahul Patil', flat: 'B-105', phone: '98765 12340', role: 'Resident', status: 'Active' },
    { name: 'Ananya Deshmukh', flat: 'A-302', phone: '98765 45670', role: 'Committee Member', status: 'Active' },
    { name: 'Amit Kulkarni', flat: 'C-101', phone: '98765 78901', role: 'Resident', status: 'Pending' }
  ];

  announcements = [
    { title: 'Water Supply Maintenance', category: 'Maintenance', date: '18 Oct 2026', description: 'Water supply may be interrupted from 10 AM to 1 PM due to scheduled maintenance.' },
    { title: 'Monthly Society Meeting', category: 'Meeting', date: '20 Oct 2026', description: 'All residents are invited to attend the monthly society meeting in the clubhouse.' },
    { title: 'Parking Area Cleaning', category: 'Notice', date: '22 Oct 2026', description: 'Please move vehicles from the basement parking area during the scheduled cleaning.' }
  ];

  events = [
    { title: 'Community Meetup', date: '24', month: 'OCT', time: '5:00 PM', location: 'Society Clubhouse', description: 'Meet your neighbours and enjoy an evening together.' },
    { title: 'Festival Celebration', date: '28', month: 'OCT', time: '6:30 PM', location: 'Central Garden', description: 'Celebrate together with music, food and activities.' },
    { title: 'Yoga & Wellness', date: '02', month: 'NOV', time: '7:00 AM', location: 'Community Hall', description: 'A refreshing morning wellness session for residents.' }
  ];

  complaints = [
    { id: 'CMP-104', title: 'Lift not working properly', flat: 'B-105', category: 'Maintenance', status: 'In Progress', date: '16 Oct 2026' },
    { id: 'CMP-103', title: 'Water leakage in corridor', flat: 'A-302', category: 'Plumbing', status: 'Open', date: '15 Oct 2026' },
    { id: 'CMP-102', title: 'Parking space issue', flat: 'C-101', category: 'Parking', status: 'Resolved', date: '14 Oct 2026' }
  ];

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  get userInitials(): string {
    const name = this.currentUser()?.name || 'User';
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
  }

  get filteredResidents() {
    const query = this.searchText.toLowerCase().trim();
    return this.residents.filter(resident =>
      `${resident.name} ${resident.flat} ${resident.role}`.toLowerCase().includes(query)
    );
  }

  setPage(page: string) {
    this.activePage = page;
    this.searchText = '';
  }

  logout() {
    this.authService.logout();
  }

  showNotice(message: string) {
    alert(message);
  }
}
