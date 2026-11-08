import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import {
  SuperAdminService,
  SocietyRecord,
  VerificationRequest,
  SocietyAdminAccount,
  PlatformUser,
  SupportTicket,
  AuditLogItem
} from '../../services/super-admin.service';
import { AuthService } from '../../services/auth.service';

export type SuperAdminTab =
  | 'Dashboard'
  | 'Societies'
  | 'Verification'
  | 'Admins'
  | 'Users'
  | 'Reports'
  | 'Support'
  | 'Audit';

@Component({
  selector: 'app-super-admin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './super-admin-dashboard.component.html',
  styleUrl: './super-admin-dashboard.component.css'
})
export class SuperAdminDashboardComponent {
  activeTab = signal<SuperAdminTab>('Dashboard');
  searchQuery = signal<string>('');
  toastMessage = signal<string | null>(null);

  // Modals state
  showTicketModal = signal<boolean>(false);
  activeTicket = signal<SupportTicket | null>(null);
  ticketReplyText = '';

  // Filter states
  societyFilter = signal<'All' | 'Active' | 'Pending Verification' | 'Suspended'>('All');
  userFilter = signal<'All' | 'Resident' | 'Secretary Admin' | 'Maintenance Staff'>('All');
  supportFilter = signal<'All' | 'Open' | 'In Progress' | 'Resolved'>('All');

  constructor(
    public adminService: SuperAdminService,
    public authService: AuthService,
    private router: Router
  ) {}

  get userInitials(): string {
    const name = this.authService.currentUser()?.name || 'Super Admin';
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  }

  get userName(): string {
    return this.authService.currentUser()?.name || 'Super Admin';
  }

  get userRole(): string {
    return this.authService.currentUser()?.role || 'Platform Super Admin';
  }

  // Filtered Societies
  filteredSocieties = computed(() => {
    const q = this.searchQuery().toLowerCase().trim();
    const filter = this.societyFilter();
    return this.adminService.societies().filter(s => {
      const matchFilter = filter === 'All' || s.status === filter;
      const matchQuery =
        !q ||
        s.name.toLowerCase().includes(q) ||
        s.location.toLowerCase().includes(q) ||
        s.adminName.toLowerCase().includes(q) ||
        s.regNumber.toLowerCase().includes(q);
      return matchFilter && matchQuery;
    });
  });

  // Filtered Users
  filteredUsers = computed(() => {
    const q = this.searchQuery().toLowerCase().trim();
    const roleFilter = this.userFilter();
    return this.adminService.platformUsers().filter(u => {
      const matchRole = roleFilter === 'All' || u.role === roleFilter;
      const matchQuery =
        !q ||
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.societyName.toLowerCase().includes(q) ||
        (u.flat && u.flat.toLowerCase().includes(q));
      return matchRole && matchQuery;
    });
  });

  // Filtered Support Tickets
  filteredTickets = computed(() => {
    const filter = this.supportFilter();
    return this.adminService.supportTickets().filter(t => {
      return filter === 'All' || t.status === filter;
    });
  });

  // Total metrics
  metrics = computed(() => {
    const societies = this.adminService.societies();
    const verifications = this.adminService.verifications();
    const users = this.adminService.platformUsers();
    const tickets = this.adminService.supportTickets();

    const totalSocieties = societies.length;
    const activeSocieties = societies.filter(s => s.status === 'Active').length;
    const pendingVerifications = verifications.filter(v => v.status === 'Under Review').length;
    const urgentTickets = tickets.filter(t => t.priority === 'Urgent' && t.status !== 'Resolved').length;

    return {
      totalSocieties,
      activeSocieties,
      pendingVerifications,
      totalUsers: 48920, // Estimated platform scale
      urgentTickets,
      uptime: '99.98%'
    };
  });

  setTab(tab: SuperAdminTab): void {
    this.activeTab.set(tab);
    this.searchQuery.set('');
  }

  // Action: Toggle Society Status
  toggleSocietyStatus(society: SocietyRecord): void {
    const newStatus = society.status === 'Active' ? 'Suspended' : 'Active';
    this.adminService.updateSocietyStatus(society.id, newStatus);
    this.showToast(`Society ${society.name} updated to ${newStatus}.`);
  }

  // Action: Verify Request
  approveVerification(req: VerificationRequest): void {
    this.adminService.verifyAndAuthorizeSociety(req.id);
    this.showToast(`Verified and activated "${req.societyName}". Primary database provisioned.`);
  }

  requestClarification(req: VerificationRequest): void {
    const note = prompt('Enter clarification request to send to Secretary:', 'Official bank account mandate missing.');
    if (note) {
      this.adminService.requestVerificationClarification(req.id, note);
      this.showToast(`Clarification request sent to ${req.secretaryEmail}.`);
    }
  }

  // Action: Admin Authorization Toggle
  toggleAdminAuth(admin: SocietyAdminAccount): void {
    this.adminService.toggleAdminAuthorization(admin.id);
    this.showToast(`Updated administrative privileges for ${admin.adminName}.`);
  }

  // Action: Reset Admin Passcode
  resetAdminPassword(admin: SocietyAdminAccount): void {
    this.showToast(`Password reset link & temporary root pass sent to ${admin.email}.`);
  }

  // Action: User status
  toggleUserStatus(user: PlatformUser): void {
    const nextStatus = user.status === 'Active' ? 'Suspended' : 'Active';
    this.adminService.updateUserStatus(user.id, nextStatus);
    this.showToast(`User ${user.name} is now ${nextStatus}.`);
  }

  unlock2FA(user: PlatformUser): void {
    this.adminService.updateUserStatus(user.id, 'Active');
    this.showToast(`2FA lockout cleared for ${user.name}. SMS recovery challenge sent.`);
  }

  // Action: Support Ticket
  viewTicket(ticket: SupportTicket): void {
    this.activeTicket.set(ticket);
    this.ticketReplyText = '';
    this.showTicketModal.set(true);
  }

  closeTicketModal(): void {
    this.showTicketModal.set(false);
    this.activeTicket.set(null);
  }

  sendTicketReply(): void {
    if (!this.ticketReplyText.trim() || !this.activeTicket()) return;
    const ticketId = this.activeTicket()!.id;
    this.adminService.replyToTicket(ticketId, this.ticketReplyText.trim());
    this.ticketReplyText = '';
    // refresh active ticket
    const updated = this.adminService.supportTickets().find(t => t.id === ticketId);
    if (updated) this.activeTicket.set(updated);
    this.showToast('Response sent to society secretary.');
  }

  markTicketResolved(): void {
    if (!this.activeTicket()) return;
    const ticketId = this.activeTicket()!.id;
    this.adminService.resolveTicket(ticketId);
    this.closeTicketModal();
    this.showToast(`Ticket ${ticketId} marked as Resolved.`);
  }

  // Export report
  exportReport(type: string): void {
    this.showToast(`Generated and downloaded ${type} report (CSV export).`);
  }

  showToast(msg: string): void {
    this.toastMessage.set(msg);
    setTimeout(() => {
      this.toastMessage.set(null);
    }, 3800);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/super-admin-login']);
  }
}
