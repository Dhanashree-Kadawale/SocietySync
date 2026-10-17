import { Routes } from '@angular/router';
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
  { path: 'dashboard', component: DashboardComponent },
  { path: 'buildings', component: BuildingsComponent },
  { path: 'billing', component: BillingComponent },
  { path: 'complaints', component: ComplaintsPageComponent },
  { path: 'residents', component: ResidentsPageComponent },
  { path: 'facilities', component: FacilitiesPageComponent },
  { path: 'visitors', component: VisitorsPageComponent },
  { path: 'notices', component: NoticesPageComponent },
  { path: 'documents', component: DocumentsPageComponent },
  { path: 'staff', component: StaffPageComponent },
  { path: 'expenses', component: ExpensesPageComponent },
  { path: 'reports', component: ReportsPageComponent },
  { path: 'settings', component: SettingsPageComponent },
  { path: '**', redirectTo: 'dashboard' }
];
