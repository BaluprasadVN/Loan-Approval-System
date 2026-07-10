import { Routes } from '@angular/router';

import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ApplyComponent } from './components/apply/apply.component';
import { LoanListComponent } from './components/loan-list/loan-list.component';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'apply', component: ApplyComponent },
  { path: 'applications', component: LoanListComponent },
  { path: '**', redirectTo: 'dashboard' }
];
