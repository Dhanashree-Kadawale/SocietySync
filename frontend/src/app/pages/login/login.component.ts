import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  identity = '';
  password = '';
  rememberMe = false;
  showPassword = false;
  isLoading = false;
  errorMessage = '';
  successMessage = '';

  // Demo accounts helper
  showDemoHelper = false;
  showForgotPasswordModal = false;
  showRegisterModal = false;
  forgotIdentity = '';
  forgotSuccess = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  fillDemo(role: 'resident' | 'admin'): void {
    if (role === 'resident') {
      this.identity = 'priya.sharma@greenwood.com';
      this.password = 'Priya@2026';
    } else {
      this.identity = 'dhanashree@societysync.com';
      this.password = 'Admin@2026';
    }
    this.errorMessage = '';
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
        rememberMe: this.rememberMe
      });

      this.successMessage = 'Sign in successful! Redirecting to your community portal...';

      setTimeout(() => {
        this.router.navigate(['/dashboard']);
      }, 700);
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
