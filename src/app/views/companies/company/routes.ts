import { Routes } from '@angular/router';

export const ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('@views/companies/company/company.component').then(m => m.CompanyComponent),
    children: [
      {
        path: 'information',
        loadChildren: () => import('./information/routes').then(m => m.ROUTES)
      },
      {
        path: 'users',
        loadChildren: () => import('./users/routes').then(m => m.ROUTES)
      },
      {
        path: 'contract',
        loadChildren: () => import('./contract/routes').then(m => m.ROUTES)
      },
      {
        path: 'accounts',
        loadChildren: () => import('./accounts/routes').then(m => m.ROUTES)
      },
      { path: '', pathMatch: 'full', redirectTo: 'information' }
    ]
  }
];
