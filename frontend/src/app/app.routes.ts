import { Routes } from '@angular/router';
import { LandingPageComponent } from './pages/landing/landing-page.component';
import { LoginComponent } from './pages/login/login.component';
import { SuperAdminLoginComponent } from './pages/super-admin-login/super-admin-login.component';
import { SuperAdminDashboardComponent } from './pages/super-admin-dashboard/super-admin-dashboard.component';
import { RegisterComponent } from './pages/register/register.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ResidentDashboardComponent } from './pages/resident-dashboard/resident-dashboard.component';
import { StaffDashboardComponent } from './pages/staff-dashboard/staff-dashboard.component';

export const routes: Routes = [
  { path: '', component: LandingPageComponent, title: 'SocietySync - Smart Housing Society Management' },
  { path: 'home', component: LandingPageComponent, title: 'SocietySync - Smart Housing Society Management' },
  { path: 'login', component: LoginComponent, title: 'Sign In - SocietySync' },
  { path: 'super-admin-login', component: SuperAdminLoginComponent, title: 'Super Admin Console - SocietySync' },
  { path: 'super-admin', component: SuperAdminDashboardComponent, title: 'Super Admin Master Console - SocietySync' },
  { path: 'super-admin-dashboard', component: SuperAdminDashboardComponent, title: 'Super Admin Master Console - SocietySync' },
  { path: 'register', component: RegisterComponent, title: 'Register - SocietySync' },
  { path: 'resident', component: ResidentDashboardComponent, title: 'Resident Portal - SocietySync' },
  { path: 'resident-dashboard', component: ResidentDashboardComponent, title: 'Resident Portal - SocietySync' },
  { path: 'staff', component: StaffDashboardComponent, title: 'Maintenance Crew Portal - SocietySync' },
  { path: 'staff-dashboard', component: StaffDashboardComponent, title: 'Maintenance Crew Portal - SocietySync' },
  { path: 'dashboard', component: DashboardComponent, title: 'Society Admin Portal - SocietySync' },
  { path: '**', redirectTo: '' }
];
