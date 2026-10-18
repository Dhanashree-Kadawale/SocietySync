import { Routes } from '@angular/router';
import { LandingPageComponent } from './pages/landing/landing-page.component';
import { LoginComponent } from './pages/login/login.component';
import { SuperAdminLoginComponent } from './pages/super-admin-login/super-admin-login.component';
import { SuperAdminDashboardComponent } from './pages/super-admin-dashboard/super-admin-dashboard.component';
import { RegisterComponent } from './pages/register/register.component';
import { ResidentDashboardComponent } from './pages/resident-dashboard/resident-dashboard.component';
import { StaffDashboardComponent } from './pages/staff-dashboard/staff-dashboard.component';
import { DashboardComponent } from './pages/dashboard/dashboard';
import { BuildingsComponent } from './pages/buildings/buildings';
import { BillingComponent } from './pages/billing/billing';
import { ComplaintsPageComponent } from './pages/complaints/complaints';
import { ResidentsPageComponent } from './pages/residents/residents';
import { FacilitiesPageComponent } from './pages/facilities/facilities';
import { VisitorsPageComponent } from './pages/visitors/visitors';
import { NoticesPageComponent } from './pages/notices/notices';
import { DocumentsPageComponent } from './pages/documents/documents';
import { StaffPageComponent } from './pages/staff/staff';
import { ExpensesPageComponent } from './pages/expenses/expenses';
import { ReportsPageComponent } from './pages/reports/reports';
import { SettingsPageComponent } from './pages/settings/settings';

export const routes: Routes = [
  // Landing and Authentication
  { path: '', component: LandingPageComponent, title: 'SocietySync - Smart Housing Society Management' },
  { path: 'home', component: LandingPageComponent, title: 'SocietySync - Smart Housing Society Management' },
  { path: 'login', component: LoginComponent, title: 'Sign In - SocietySync' },
  { path: 'register', component: RegisterComponent, title: 'Register - SocietySync' },
  { path: 'super-admin-login', component: SuperAdminLoginComponent, title: 'Super Admin Console - SocietySync' },
  { path: 'super-admin', component: SuperAdminDashboardComponent, title: 'Super Admin Master Console - SocietySync' },
  { path: 'super-admin-dashboard', component: SuperAdminDashboardComponent, title: 'Super Admin Master Console - SocietySync' },

  // Role-Specific Dashboards
  { path: 'resident', component: ResidentDashboardComponent, title: 'Resident Portal - SocietySync' },
  { path: 'resident-dashboard', component: ResidentDashboardComponent, title: 'Resident Portal - SocietySync' },
  { path: 'staff-dashboard', component: StaffDashboardComponent, title: 'Maintenance Crew Portal - SocietySync' },

  // Admin / Society Management Portal
  { path: 'dashboard', component: DashboardComponent, title: 'Dashboard - SocietySync' },
  { path: 'buildings', component: BuildingsComponent, title: 'Flat Information - SocietySync' },
  { path: 'billing', component: BillingComponent, title: 'Maintenance Bills - SocietySync' },
  { path: 'complaints', component: ComplaintsPageComponent, title: 'Complaints - SocietySync' },
  { path: 'residents', component: ResidentsPageComponent, title: 'Residents - SocietySync' },
  { path: 'facilities', component: FacilitiesPageComponent, title: 'Facility Booking - SocietySync' },
  { path: 'visitors', component: VisitorsPageComponent, title: 'Visitor Management - SocietySync' },
  { path: 'notices', component: NoticesPageComponent, title: 'Notice Board - SocietySync' },
  { path: 'documents', component: DocumentsPageComponent, title: 'Document Access - SocietySync' },
  { path: 'staff', component: StaffPageComponent, title: 'Staff Management - SocietySync' },
  { path: 'expenses', component: ExpensesPageComponent, title: 'Expenses & Dues - SocietySync' },
  { path: 'reports', component: ReportsPageComponent, title: 'Polls & Reports - SocietySync' },
  { path: 'settings', component: SettingsPageComponent, title: 'Society Settings - SocietySync' },

  // Catch-all
  { path: '**', redirectTo: '' }
];
