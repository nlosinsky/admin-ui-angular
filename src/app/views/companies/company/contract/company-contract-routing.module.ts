import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CompanyContractComponent } from '@views/companies/company/contract/company-contract.component';

const routes: Routes = [{ path: '', component: CompanyContractComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CompanyContractRoutingModule {}
