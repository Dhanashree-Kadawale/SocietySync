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
        societyName: 'Greenwood Heights Co-op Society',
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
        societyName: 'Greenwood Heights Co-op Society',
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
        societyName: 'Greenwood Heights Co-op Society',
        token: 'mock-jwt-staff-303'
      },
      defaultPass: 'Staff@2026'
    }
  };

  private readonly API_BASE = 'http://localhost:8080/api';

  constructor(private router: Router) {}

  private getStoredUser(): User | null {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY) || sessionStorage.getItem(this.STORAGE_KEY);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  }

  public getToken(): string | null {
    return this.currentUserSignal()?.token || null;
  }

  private mapBackendRole(roles: string[] | undefined, defaultRole: UserRole): UserRole {
    if (!roles || roles.length === 0) return defaultRole;
    if (roles.includes('ROLE_SUPER_ADMIN')) return 'Super Admin';
    if (roles.includes('ROLE_SOCIETY_ADMIN') || roles.includes('ROLE_SECRETARY_ADMIN')) return 'Secretary Admin';
    if (roles.includes('ROLE_MAINTENANCE_STAFF') || roles.includes('ROLE_SECURITY_GUARD')) return 'Maintenance Staff';
    if (roles.includes('ROLE_RESIDENT')) return 'Resident';
    return defaultRole;
  }

  async login(credentials: LoginRequest): Promise<boolean> {
    const role = credentials.role || 'Resident';
    try {
      const response = await fetch(`${this.API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          identity: credentials.identity.trim(),
          password: credentials.password,
          role: credentials.role,
          rememberMe: credentials.rememberMe
        })
      });

      if (!response.ok) {
        const errJson = await response.json().catch(() => null);
        const msg = errJson?.message || (response.status === 401 ? 'Invalid email/phone or password.' : 'Authentication failed.');
        throw new Error(msg);
      }

      const authData = await response.json();
      const mappedRole = this.mapBackendRole(authData.user?.roles, role);

      const user: User = {
        id: String(authData.user.id),
        name: authData.user.name,
        email: authData.user.email,
        phone: authData.user.phone || '',
        flat: authData.user.flatNumber || (mappedRole === 'Resident' ? 'A-204' : mappedRole === 'Secretary Admin' ? 'B-401' : 'HQ-Central'),
        role: mappedRole,
        societyName: authData.user.societyName || 'Greenwood Heights Co-op Society',
        avatar: authData.user.avatarUrl,
        token: authData.token
      };

      this.currentUserSignal.set(user);
      const storage = credentials.rememberMe ? localStorage : sessionStorage;
      storage.setItem(this.STORAGE_KEY, JSON.stringify(user));
      return true;
    } catch (err: any) {
      if (err instanceof Error && !err.message.includes('Failed to fetch')) {
        throw err;
      }

      console.warn('Backend server offline or unreachable. Falling back to local demo profile.', err);
      const template = this.demoProfiles[role].user;
      const user: User = {
        ...template,
        email: credentials.identity.includes('@') ? credentials.identity : template.email,
        phone: !credentials.identity.includes('@') ? credentials.identity : template.phone,
        role: role
      };

      this.currentUserSignal.set(user);
      const storage = credentials.rememberMe ? localStorage : sessionStorage;
      storage.setItem(this.STORAGE_KEY, JSON.stringify(user));
      return true;
    }
  }

  async getMe(): Promise<User | null> {
    const token = this.getToken();
    if (!token) return null;

    try {
      const response = await fetch(`${this.API_BASE}/auth/me`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const profile = await response.json();
        const current = this.currentUserSignal();
        if (current) {
          const updated: User = {
            ...current,
            id: String(profile.id),
            name: profile.name,
            email: profile.email,
            phone: profile.phone || current.phone,
            societyName: profile.societyName || current.societyName
          };
          this.currentUserSignal.set(updated);
          return updated;
        }
      }
    } catch (err) {
      console.error('Failed to refresh user profile from /api/auth/me', err);
    }
    return this.currentUserSignal();
  }

  logout() {
    this.currentUserSignal.set(null);
    localStorage.removeItem(this.STORAGE_KEY);
    sessionStorage.removeItem(this.STORAGE_KEY);
    this.router.navigate(['/login']);
  }
}
