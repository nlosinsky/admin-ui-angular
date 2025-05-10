import { Routes } from '@angular/router';

export const ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('@views/companies/table/companies-table.component').then(m => m.CompaniesTableComponent)
  },
  {
    path: ':companyId',
    loadChildren: () => import('./company/routes').then(m => m.ROUTES)
  }
];
