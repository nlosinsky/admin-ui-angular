import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CompaniesTableComponent } from '@views/companies/table/companies-table.component';

const routes: Routes = [
  {
    path: '',
    component: CompaniesTableComponent
  }
  // todo
  // {
  //   path: ':companyId',
  //   loadChildren: () => import('./company/company.module').then(m => m.CompanyModule)
  // }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CompaniesRoutingModule {}
