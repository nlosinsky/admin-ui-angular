import { Routes } from '@angular/router';
import { CompanyUsersComponent } from '@views/companies/company/users/company-users.component';
import { CompanyUserComponent } from '@views/companies/company/users/user/company-user.component';

export const ROUTES: Routes = [
  { path: '', component: CompanyUsersComponent },
  { path: ':id', component: CompanyUserComponent }
];
