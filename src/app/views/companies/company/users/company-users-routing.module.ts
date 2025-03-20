import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CompanyUsersComponent } from '@views/companies/company/users/company-users.component';
import { CompanyUserComponent } from '@views/companies/company/users/components/user/company-user.component';

const routes: Routes = [
  { path: '', component: CompanyUsersComponent },
  { path: ':id', component: CompanyUserComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CompanyUsersRoutingModule {}
