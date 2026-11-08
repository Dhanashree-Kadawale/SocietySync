import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { UserRole } from '../../models/user.model';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  selectedRole: UserRole = 'Resident';
  identity = '';
  password = '';
  rememberMe = false;
  showPassword = false;
  isLoading = false;
  errorMessage = '';
  successMessage = '';

  roles: { role: UserRole; label: string; icon: string; subtitle: string }[] = [
    { role: 'Resident', label: 'Resident', icon: '🏠', subtitle: 'Access society services, dues & bookings' },
    { role: 'Secretary Admin', label: 'Secretary Admin', icon: '📋', subtitle: 'Society management & approvals' },
    { role: 'Maintenance Staff', label: 'Staff', icon: '🔧', subtitle: 'Service tickets & resolution updates' }
  ];

  showForgotPasswordModal = false;
  showRegisterModal = false;
  forgotIdentity = '';
  forgotSuccess = false;

  constructor(
    public authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const isRegistered = params['registered'] === 'true';
      let roleParam = params['role'];
      let emailParam = params['email'];

      if (isRegistered) {
        if (!emailParam) {
          try {
            emailParam = sessionStorage.getItem('last_registered_email') || '';
          } catch {}
        }
        if (!roleParam) {
          try {
            roleParam = sessionStorage.getItem('last_registered_role') || '';
          } catch {}
        }
        // Clear after one-time consumption so subsequent visits start clean
        try {
          sessionStorage.removeItem('last_registered_email');
          sessionStorage.removeItem('last_registered_role');
        } catch {}
      }

      if (emailParam) {
        this.identity = emailParam;
      }

      if (roleParam) {
        const queryRole = (roleParam as string).toLowerCase();
        if (queryRole.includes('secretary') || queryRole.includes('admin')) {
          this.selectedRole = 'Secretary Admin';
        } else if (queryRole.includes('staff') || queryRole.includes('maintenance') || queryRole.includes('crew')) {
          this.selectedRole = 'Maintenance Staff';
        } else if (queryRole.includes('resident')) {
          this.selectedRole = 'Resident';
        }
      }

      if (isRegistered && this.identity) {
        this.successMessage = `Account registered successfully for ${this.identity}! Enter your password to sign in as ${this.selectedRole}.`;
      }
    });
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  selectRole(role: UserRole): void {
    this.selectedRole = role;
    this.errorMessage = '';
    this.successMessage = '';
  }

  fillDemoAccount(): void {
    const demo = this.authService.demoProfiles[this.selectedRole];
    if (demo) {
      this.identity = demo.user.email;
      this.password = demo.defaultPass;
      this.errorMessage = '';
    }
  }

  async onSubmit(): Promise<void> {
    this.errorMessage = '';
    this.successMessage = '';

    const id = this.identity.trim();
    if (!id) {
      this.errorMessage = 'Please enter your email address or registered mobile number.';
      return;
    }

    if (!this.password) {
      this.errorMessage = 'Please enter your password.';
      return;
    }

    this.isLoading = true;

    try {
      await this.authService.login({
        identity: id,
        password: this.password,
        role: this.selectedRole,
        rememberMe: this.rememberMe
      });

      const resolvedRole = this.authService.currentUser()?.role || this.selectedRole;
      this.successMessage = `Sign in successful as ${resolvedRole}! Redirecting to portal...`;

      setTimeout(() => {
        if (resolvedRole === 'Resident') {
          this.router.navigate(['/resident']);
        } else if (resolvedRole === 'Maintenance Staff') {
          this.router.navigate(['/staff-dashboard']);
        } else if (resolvedRole === 'Super Admin') {
          this.router.navigate(['/super-admin']);
        } else {
          this.router.navigate(['/dashboard']);
        }
      }, 300);
    } catch (err: any) {
      this.errorMessage = err?.message || 'Invalid credentials. Please verify your email/phone and password.';
    } finally {
      this.isLoading = false;
    }
  }

  openForgotPassword(event: Event): void {
    event.preventDefault();
    this.forgotIdentity = this.identity;
    this.forgotSuccess = false;
    this.showForgotPasswordModal = true;
  }

  closeForgotPassword(): void {
    this.showForgotPasswordModal = false;
    this.forgotSuccess = false;
  }

  submitForgotPassword(): void {
    if (!this.forgotIdentity.trim()) return;
    this.forgotSuccess = true;
  }

  openRegister(event: Event): void {
    event.preventDefault();
    this.showRegisterModal = true;
  }

  closeRegister(): void {
    this.showRegisterModal = false;
  }
}
