import { Routes } from '@angular/router';

export const ROUTES: Routes = [
  {
    path: 'login',
    loadComponent: () => import('@app/auth/login/login.component').then(m => m.LoginComponent)
  },
  { path: '', pathMatch: 'full', redirectTo: 'login' }
];
