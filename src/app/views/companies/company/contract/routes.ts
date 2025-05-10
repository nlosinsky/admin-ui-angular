import { Routes } from '@angular/router';

export const ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('@views/companies/company/contract/company-contract.component').then(m => m.CompanyContractComponent)
  }
];
