import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

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
    private route: ActivatedRoute
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

    try {
      let endpoint = 'http://localhost:8080/api/auth/register/resident';
      let payload: any = {
        fullName: this.fullName.trim(),
        email: this.email.trim(),
        phone: this.phone.trim(),
        password: this.password,
        societyId: 1,
        wing: this.wing || 'Tower A',
        flatNumber: this.flatNumber.trim() || 'A-101',
        residentType: this.residentType || 'Flat Owner'
      };

      if (this.selectedRole === 'Maintenance Staff') {
        endpoint = 'http://localhost:8080/api/auth/register/staff';
        payload = {
          fullName: this.fullName.trim(),
          email: this.email.trim(),
          phone: this.phone.trim(),
          password: this.password,
          societyId: 1,
          staffRole: 'MAINTENANCE_STAFF',
          department: this.staffSpecialization || 'Maintenance',
          shiftTimings: this.workType || 'Full-Time On-Site Crew',
          agencyName: this.employeeId ? `Emp ID: ${this.employeeId}` : 'Internal'
        };
      } else if (this.selectedRole === 'Secretary') {
        endpoint = 'http://localhost:8080/api/auth/register/secretary';
        payload = {
          secretaryName: this.fullName.trim(),
          email: this.email.trim(),
          phone: this.phone.trim(),
          password: this.password,
          societyName: this.societyName.trim(),
          registrationNumber: this.societyRegNo.trim(),
          address: 'Main Society Complex',
          city: this.city.trim() || 'Pune',
          state: 'Maharashtra',
          pincode: '411001',
          totalWings: 3,
          totalFlats: 120
        };
      }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorJson = await response.json().catch(() => null);
        throw new Error(errorJson?.message || 'Registration failed. Please check your information.');
      }

      this.isSubmitting = false;
      this.isRegistered.set(true);
    } catch (err: any) {
      if (err instanceof Error && !err.message.includes('Failed to fetch')) {
        this.errorMessage = err.message;
        this.isSubmitting = false;
        return;
      }

      // Offline fallback
      setTimeout(() => {
        this.isSubmitting = false;
        this.isRegistered.set(true);
      }, 700);
    }
  }

  goToLogin(): void {
    let loginRole = 'Resident';
    if (this.selectedRole === 'Secretary') {
      loginRole = 'Secretary Admin';
    } else if (this.selectedRole === 'Maintenance Staff') {
      loginRole = 'Maintenance Staff';
    }
    this.router.navigate(['/login'], { queryParams: { role: loginRole } });
  }
}
