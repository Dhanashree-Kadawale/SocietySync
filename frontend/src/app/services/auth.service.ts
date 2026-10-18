import { Injectable, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { User, LoginRequest, UserRole } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly STORAGE_KEY = 'societysync_user';

  private currentUserSignal = signal<User | null>(this.getStoredUser());

  readonly currentUser = this.currentUserSignal.asReadonly();
  readonly isAuthenticated = computed(() => !!this.currentUserSignal());

  // Demo user fixtures for 4 roles
  readonly demoProfiles: Record<UserRole, { user: User; defaultPass: string }> = {
    'Resident': {
      user: {
        id: 'USR-RES-101',
        name: 'Priya Sharma',
        email: 'priya.sharma@greenwood.com',
        phone: '+91 98765 12340',
        flat: 'A-204',
        role: 'Resident',
        societyName: 'Greenwood Heights',
        token: 'mock-jwt-resident-101'
      },
      defaultPass: 'Resident@2026'
    },
    'Secretary Admin': {
      user: {
        id: 'USR-SEC-202',
        name: 'Rajesh Mehta',
        email: 'secretary@greenwood.com',
        phone: '+91 98765 88990',
        flat: 'B-401',
        role: 'Secretary Admin',
        societyName: 'Greenwood Heights',
        token: 'mock-jwt-secretary-202'
      },
      defaultPass: 'Secretary@2026'
    },
    'Super Admin': {
      user: {
        id: 'USR-SUP-001',
        name: 'Dhanashree Kadawale',
        email: 'superadmin@societysync.com',
        phone: '+91 98765 43210',
        flat: 'HQ-Central',
        role: 'Super Admin',
        societyName: 'SocietySync Global HQ',
        token: 'mock-jwt-superadmin-001'
      },
      defaultPass: 'SuperAdmin@2026'
    },
    'Maintenance Staff': {
      user: {
        id: 'USR-STAFF-303',
        name: 'Ramesh Shinde',
        email: 'maintenance.lead@greenwood.com',
        phone: '+91 98765 77112',
        flat: 'Operations Unit',
        role: 'Maintenance Staff',
        societyName: 'Greenwood Heights',
        token: 'mock-jwt-staff-303'
      },
      defaultPass: 'Staff@2026'
    }
  };

  constructor(private router: Router) {}

  private getStoredUser(): User | null {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY) || sessionStorage.getItem(this.STORAGE_KEY);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  }

  login(credentials: LoginRequest): Promise<boolean> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const role = credentials.role || 'Resident';
        const template = this.demoProfiles[role].user;

        const user: User = {
          ...template,
          email: credentials.identity.includes('@') ? credentials.identity : template.email,
          phone: !credentials.identity.includes('@') ? credentials.identity : template.phone,
          role: role
        };

        this.currentUserSignal.set(user);

        if (credentials.rememberMe) {
          localStorage.setItem(this.STORAGE_KEY, JSON.stringify(user));
        } else {
          sessionStorage.setItem(this.STORAGE_KEY, JSON.stringify(user));
        }

        resolve(true);
      }, 500);
    });
  }

  logout() {
    this.currentUserSignal.set(null);
    localStorage.removeItem(this.STORAGE_KEY);
    sessionStorage.removeItem(this.STORAGE_KEY);
    this.router.navigate(['/login']);
  }
}
