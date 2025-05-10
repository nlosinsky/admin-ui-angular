import { Routes } from '@angular/router';

export const ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('@views/usage/usage-table.component').then(m => m.UsageTableComponent)
  }
];
