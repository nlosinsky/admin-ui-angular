import { Routes } from '@angular/router';

export const ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('@views/companies/company/users/company-users.component').then(m => m.CompanyUsersComponent)
  },
  {
    path: ':id',
    loadComponent: () =>
      import('@views/companies/company/users/user/company-user.component').then(m => m.CompanyUserComponent)
  }
];
