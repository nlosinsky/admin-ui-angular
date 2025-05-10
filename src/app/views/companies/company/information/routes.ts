import { Routes } from '@angular/router';

export const ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('@views/companies/company/information/company-information.component').then(
        m => m.CompanyInformationComponent
      )
  }
];
