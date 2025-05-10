import { Routes } from '@angular/router';

export const ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('@views/companies/company/accounts/company-accounts.component').then(m => m.CompanyAccountsComponent)
  }
];
