import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CompanyComponent } from '@views/companies/company/company.component';

const routes: Routes = [
  {
    path: '',
    component: CompanyComponent,
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'information' },
      {
        path: 'information',
        loadChildren: () => import('./information/company-information.module').then(m => m.CompanyInformationModule)
      },
      {
        path: 'users',
        loadChildren: () => import('./users/company-users.module').then(m => m.CompanyUsersModule)
      },
      {
        path: 'contract',
        loadChildren: () => import('./contract/company-contract.module').then(m => m.CompanyContractModule)
      },
      {
        path: 'accounts',
        loadChildren: () => import('./accounts/company-accounts.module').then(m => m.CompanyAccountsModule)
      }
      // {
      //   path: 'finance',
      //   loadChildren: () => import('./finance/company-finance.module').then(m => m.CompanyFinanceModule)
      // },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CompanyRoutingModule {}
