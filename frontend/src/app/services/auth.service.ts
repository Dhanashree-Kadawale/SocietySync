import { Injectable, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { User, LoginRequest } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly STORAGE_KEY = 'societysync_user';

  private currentUserSignal = signal<User | null>(this.getStoredUser());

  readonly currentUser = this.currentUserSignal.asReadonly();
  readonly isAuthenticated = computed(() => !!this.currentUserSignal());

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
        // Mock user based on input or default resident profile
        const isDhanashree = credentials.identity.toLowerCase().includes('dhana') || credentials.identity.toLowerCase().includes('admin');
        const user: User = isDhanashree
          ? {
              id: 'USR-ADMIN-01',
              name: 'Dhanashree Kadawale',
              email: credentials.identity.includes('@') ? credentials.identity : 'dhanashree@societysync.com',
              phone: credentials.identity.includes('@') ? '+91 98765 43210' : credentials.identity,
              flat: 'A-302',
              role: 'Society Admin',
              societyName: 'Greenwood Heights',
              token: 'mock-jwt-token-admin'
            }
          : {
              id: 'USR-RES-01',
              name: 'Priya Sharma',
              email: credentials.identity.includes('@') ? credentials.identity : 'priya.sharma@greenwood.com',
              phone: credentials.identity.includes('@') ? '+91 98765 12340' : credentials.identity,
              flat: 'A-204',
              role: 'Resident',
              societyName: 'Greenwood Heights',
              token: 'mock-jwt-token-resident'
            };

        this.currentUserSignal.set(user);

        if (credentials.rememberMe) {
          localStorage.setItem(this.STORAGE_KEY, JSON.stringify(user));
        } else {
          sessionStorage.setItem(this.STORAGE_KEY, JSON.stringify(user));
        }

        resolve(true);
      }, 600);
    });
  }

  logout() {
    this.currentUserSignal.set(null);
    localStorage.removeItem(this.STORAGE_KEY);
    sessionStorage.removeItem(this.STORAGE_KEY);
    this.router.navigate(['/login']);
  }
}
