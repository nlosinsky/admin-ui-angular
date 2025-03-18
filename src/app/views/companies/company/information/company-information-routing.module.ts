import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CompanyInformationComponent } from '@views/companies/company/information/company-information.component';

const routes: Routes = [{ path: '', component: CompanyInformationComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CompanyInformationRoutingModule {}
