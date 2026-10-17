import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'login' },
  { path: 'login', component: LoginComponent, title: 'Resident Login - SocietySync' },
  { path: 'dashboard', component: DashboardComponent, title: 'Portal - SocietySync' },
  { path: '**', redirectTo: 'login' }
];
