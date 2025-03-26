import { Routes } from '@angular/router';
import { CompaniesTableComponent } from '@views/companies/table/companies-table.component';

export const ROUTES: Routes = [
  {
    path: '',
    component: CompaniesTableComponent
  },
  {
    path: ':companyId',
    loadChildren: () => import('./company/routes').then(m => m.ROUTES)
  }
];
