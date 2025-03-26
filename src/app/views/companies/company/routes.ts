import { Routes } from '@angular/router';
import { CompanyComponent } from '@views/companies/company/company.component';

export const ROUTES: Routes = [
  {
    path: '',
    component: CompanyComponent,
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
