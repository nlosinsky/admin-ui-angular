import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CompanyAccountsComponent } from '@views/companies/company/accounts/company-accounts.component';

const routes: Routes = [{ path: '', component: CompanyAccountsComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CompanyAccountsRoutingModule {}
