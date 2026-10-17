import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-super-admin-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './super-admin-login.component.html',
  styleUrl: './super-admin-login.component.css'
})
export class SuperAdminLoginComponent {
  masterEmail = 'superadmin@societysync.com';
  masterPassword = 'SuperAdmin@2026';
  securityToken = 'ROOT-8941';
  rememberSession = true;
  showPassword = false;
  isLoading = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  async onSubmit(): Promise<void> {
    this.errorMessage = '';
    this.successMessage = '';

    if (!this.masterEmail.trim() || !this.masterPassword.trim()) {
      this.errorMessage = 'Please provide both master admin email and root passcode.';
      return;
    }

    this.isLoading = true;

    try {
      const success = await this.authService.login({
        identity: this.masterEmail.trim(),
        password: this.masterPassword,
        role: 'Super Admin',
        rememberMe: this.rememberSession
      });

      if (success) {
        this.successMessage = 'Root authentication successful. Launching Master Console...';
        setTimeout(() => {
          this.router.navigate(['/super-admin']);
        }, 500);
      } else {
        this.errorMessage = 'Invalid root credentials or unauthorized access attempt.';
      }
    } catch (err: any) {
      this.errorMessage = err?.message || 'Master authentication error.';
    } finally {
      this.isLoading = false;
    }
  }

  loadDemoCredentials(): void {
    this.masterEmail = 'superadmin@societysync.com';
    this.masterPassword = 'SuperAdmin@2026';
    this.securityToken = 'ROOT-8941';
    this.errorMessage = '';
  }
}
