import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CompanyFinanceComponent } from '@views/companies/company/finance/company-finance.component';

const routes: Routes = [{ path: '', component: CompanyFinanceComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CompanyFinanceRoutingModule {}
