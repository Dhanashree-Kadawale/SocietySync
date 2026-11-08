import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

export type RegisterRole = 'Secretary' | 'Maintenance Staff' | 'Resident';

export interface RegisterRoleOption {
  role: RegisterRole;
  label: string;
  icon: string;
  badge: string;
}

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit {
  selectedRole: RegisterRole = 'Secretary';

  roles: RegisterRoleOption[] = [
    { role: 'Secretary', label: 'Secretary (Admin)', icon: '📋', badge: 'SOCIETY ONBOARDING' },
    { role: 'Maintenance Staff', label: 'Maintenance Staff', icon: '🔧', badge: 'CREW ONBOARDING' },
    { role: 'Resident', label: 'Resident', icon: '🏠', badge: 'RESIDENT ONBOARDING' }
  ];

  // Common User Credentials
  fullName = '';
  email = '';
  phone = '';
  password = '';
  confirmPassword = '';

  // 1. Secretary / Society Registration Fields
  societyName = '';
  societyRegNo = '';
  city = '';
  totalUnits = '120 Units (3 Towers)';
  secretaryDesignation = 'Society Secretary';

  // 2. Maintenance Staff Registration Fields
  staffSpecialization = 'Electrician';
  staffSociety = 'Greenwood Heights Co-op Society';
  workType = 'Full-Time On-Site Crew';
  employeeId = '';

  // 3. Resident Registration Fields
  wing = 'Tower A';
  flatNumber = '';
  residentType = 'Flat Owner';

  isSubmitting = false;
  isRegistered = signal<boolean>(false);
  errorMessage = '';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['role']) {
        const paramRole = (params['role'] as string).toLowerCase();
        if (paramRole.includes('secretary') || paramRole.includes('admin')) {
          this.selectRole('Secretary');
        } else if (paramRole.includes('staff') || paramRole.includes('maintenance')) {
          this.selectRole('Maintenance Staff');
        } else if (paramRole.includes('resident')) {
          this.selectRole('Resident');
        }
      }
    });
  }

  selectRole(role: RegisterRole): void {
    this.selectedRole = role;
    this.errorMessage = '';
  }

  async onSubmit(): Promise<void> {
    this.errorMessage = '';

    // Validate common fields
    if (!this.fullName.trim() || !this.email.trim() || !this.phone.trim()) {
      this.errorMessage = 'Please provide your full legal name, email, and mobile number.';
      return;
    }

    if (!this.password || this.password.length < 6) {
      this.errorMessage = 'Password must be at least 6 characters.';
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Passwords do not match.';
      return;
    }

    // Role-specific validation
    if (this.selectedRole === 'Secretary') {
      if (!this.societyName.trim()) {
        this.errorMessage = 'Please enter your Housing Society Name.';
        return;
      }
      if (!this.societyRegNo.trim()) {
        this.errorMessage = 'Please enter the Society Registration / RERA Number.';
        return;
      }
    } else if (this.selectedRole === 'Maintenance Staff') {
      if (!this.employeeId.trim()) {
        this.errorMessage = 'Please enter your Employee ID or Vendor Badge number.';
        return;
      }
    } else if (this.selectedRole === 'Resident') {
      if (!this.flatNumber.trim()) {
        this.errorMessage = 'Please specify your registered Flat Number.';
        return;
      }
    }

    this.isSubmitting = true;

    const payload = {
      name: this.fullName.trim(),
      email: this.email.trim(),
      phone: this.phone.trim(),
      password: this.password,
      role: this.selectedRole,
      societyName: this.selectedRole === 'Secretary' ? this.societyName.trim() : (this.selectedRole === 'Maintenance Staff' ? this.staffSociety : ''),
      societyRegNo: this.societyRegNo.trim(),
      city: this.city.trim() || 'Pune',
      totalUnits: this.totalUnits,
      flatNumber: this.flatNumber.trim(),
      buildingName: this.wing.trim(),
      staffSpecialization: this.staffSpecialization,
      employeeId: this.employeeId.trim(),
      residentType: this.residentType
    };

    try {
      await this.authService.register(payload);
      this.isRegistered.set(true);

      let loginRole = 'Resident';
      if (this.selectedRole === 'Secretary') {
        loginRole = 'Secretary Admin';
      } else if (this.selectedRole === 'Maintenance Staff') {
        loginRole = 'Maintenance Staff';
      }
      try {
        sessionStorage.setItem('last_registered_email', this.email.trim());
        sessionStorage.setItem('last_registered_role', loginRole);
      } catch {}
    } catch (err: any) {
      this.errorMessage = err?.message || 'Registration failed. Please verify your details.';
    } finally {
      this.isSubmitting = false;
    }
  }

  goToLogin(): void {
    let loginRole = 'Resident';
    if (this.selectedRole === 'Secretary') {
      loginRole = 'Secretary Admin';
    } else if (this.selectedRole === 'Maintenance Staff') {
      loginRole = 'Maintenance Staff';
    }
    this.router.navigate(['/login'], { queryParams: { role: loginRole, email: this.email.trim(), registered: 'true' } });
  }

  enterDashboard(): void {
    if (this.selectedRole === 'Secretary') {
      this.router.navigate(['/dashboard']);
    } else if (this.selectedRole === 'Maintenance Staff') {
      this.router.navigate(['/staff-dashboard']);
    } else {
      this.router.navigate(['/resident']);
    }
  }
}
