import { Routes } from '@angular/router';

import { authGuard } from '@app/auth/guards/auth.guard';
import { noAuthGuard } from '@app/auth/guards/no-auth.guard';

export const APP_ROUTES: Routes = [
  {
    path: 'auth',
    canActivate: [noAuthGuard],
    loadChildren: () => import('./auth/routes').then(m => m.ROUTES)
  },
  {
    path: '',
    loadComponent: () => import('@app/app-layout.component').then(m => m.AppLayoutComponent),
    canActivate: [authGuard],
    children: [
      {
        path: 'companies',
        loadChildren: () => import('./views/companies/routes').then(m => m.ROUTES)
      },
      {
        path: 'usage',
        loadChildren: () => import('./views/usage/routes').then(m => m.ROUTES)
      },
      {
        path: 'transactions',
        loadChildren: () => import('./views/transactions/routes').then(m => m.ROUTES)
      },
      { path: '', pathMatch: 'full', redirectTo: 'companies' }
    ]
  }
];
