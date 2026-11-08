import { Injectable, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { firstValueFrom, BehaviorSubject } from 'rxjs';
import { User, LoginRequest, UserRole } from '../models/user.model';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly STORAGE_KEY = 'societysync_user';

  private currentUserSignal = signal<User | null>(this.getStoredUser());

  readonly currentUser = this.currentUserSignal.asReadonly();
  readonly isAuthenticated = computed(() => !!this.currentUserSignal());
  readonly authStateChanged$ = new BehaviorSubject<User | null>(this.getStoredUser());

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

  constructor(private router: Router, private apiService: ApiService) {
    const storedUser = this.currentUserSignal();
    const missingResidentId = storedUser?.role === 'Resident' && !storedUser.residentId;
    if (storedUser && (!storedUser.userId || !storedUser.societyId || missingResidentId)) {
      this.refreshStoredUser(storedUser);
    }
  }

  private getStoredUser(): User | null {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY) || sessionStorage.getItem(this.STORAGE_KEY);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  }

  private refreshStoredUser(storedUser: User) {
    const identity = storedUser.email || storedUser.phone;
    if (!identity) return;

    this.apiService.getMe(identity).subscribe({
      next: response => {
        if (!response?.success || !response.data) {
          console.error('Unable to refresh the stored SocietySync account.', response?.message);
          return;
        }

        const account = response.data;
        const user: User = {
          ...storedUser,
          id: account.id || storedUser.id,
          userId: account.userId,
          residentId: account.residentId,
          societyId: account.societyId,
          name: account.name || storedUser.name,
          flat: account.flat || '',
          role: (account.role || storedUser.role) as UserRole,
          societyName: account.societyName || storedUser.societyName,
          token: account.token
        };
        this.currentUserSignal.set(user);
        this.authStateChanged$.next(user);
        const storage = localStorage.getItem(this.STORAGE_KEY) ? localStorage : sessionStorage;
        storage.setItem(this.STORAGE_KEY, JSON.stringify(user));
      },
      error: error => console.error('Unable to refresh the stored SocietySync account.', error)
    });
  }

  async login(credentials: LoginRequest): Promise<boolean> {
    const role = credentials.role || 'Resident';
    try {
      const res = await firstValueFrom(this.apiService.login({
        identity: credentials.identity.trim(),
        password: credentials.password,
        role: role,
        rememberMe: credentials.rememberMe
      }));

      if (res && res.success && res.data) {
        const u = res.data;
        const user: User = {
          id: u.id || ('USR-' + u.userId),
          userId: u.userId,
          residentId: u.residentId,
          societyId: u.societyId,
          name: u.name,
          email: u.email,
          phone: u.phone || '',
          flat: u.flat || '',
          role: (u.role || role) as UserRole,
          societyName: u.societyName || '',
          token: u.token
        };

        this.currentUserSignal.set(user);
        this.authStateChanged$.next(user);
        if (credentials.rememberMe) {
          localStorage.setItem(this.STORAGE_KEY, JSON.stringify(user));
        } else {
          localStorage.removeItem(this.STORAGE_KEY);
          sessionStorage.setItem(this.STORAGE_KEY, JSON.stringify(user));
        }
        return true;
      } else {
        throw new Error(res?.message || 'Invalid email/phone or password');
      }
    } catch (err: any) {
      const msg = err?.error?.message || err?.message || 'Authentication failed. Please verify credentials.';
      throw new Error(msg);
    }
  }

  async register(data: any): Promise<boolean> {
    try {
      const res = await firstValueFrom(this.apiService.register(data));
      if (res && res.success && res.data) {
        const u = res.data;
        const user: User = {
          id: u.id || ('USR-' + u.userId),
          userId: u.userId,
          residentId: u.residentId,
          societyId: u.societyId,
          name: u.name,
          email: u.email,
          phone: u.phone,
          flat: u.flat || '',
          role: (u.role || 'Resident') as UserRole,
          societyName: u.societyName || '',
          token: u.token
        };
        this.currentUserSignal.set(user);
        this.authStateChanged$.next(user);
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(user));
        return true;
      } else {
        throw new Error(res?.message || 'Registration failed');
      }
    } catch (err: any) {
      const msg = err?.error?.message || err?.message || 'Registration failed. Please check your details.';
      throw new Error(msg);
    }
  }

  logout() {
    this.currentUserSignal.set(null);
    this.authStateChanged$.next(null);
    localStorage.removeItem(this.STORAGE_KEY);
    sessionStorage.removeItem(this.STORAGE_KEY);
    this.router.navigate(['/login']);
  }
}
