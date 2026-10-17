import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
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
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'login', component: LoginComponent, title: 'Resident Login - SocietySync' },
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
  { path: '**', redirectTo: 'dashboard' }
];
