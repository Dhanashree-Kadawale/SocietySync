import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { UserRole } from '../../models/user.model';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  selectedRole: UserRole = 'Resident';
  identity = 'priya.sharma@greenwood.com';
  password = 'Resident@2026';
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
      if (params['role']) {
        const queryRole = (params['role'] as string).toLowerCase();
        const matched = this.roles.find(
          r => r.role.toLowerCase() === queryRole || r.label.toLowerCase() === queryRole
        );
        if (matched) {
          this.selectRole(matched.role);
        }
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
    const demo = this.authService.demoProfiles[role];
    if (demo) {
      this.identity = demo.user.email;
      this.password = demo.defaultPass;
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

      this.successMessage = `Sign in successful as ${this.selectedRole}! Redirecting...`;

      setTimeout(() => {
        if (this.selectedRole === 'Resident') {
          this.router.navigate(['/resident']);
        } else if (this.selectedRole === 'Maintenance Staff') {
          this.router.navigate(['/staff']);
        } else {
          this.router.navigate(['/dashboard']);
        }
      }, 600);
    } catch {
      this.errorMessage = 'Invalid credentials. Please verify your details.';
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
