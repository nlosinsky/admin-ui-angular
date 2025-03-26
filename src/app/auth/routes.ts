import { Routes } from '@angular/router';
import { noAuthGuard } from '@app/auth/guards/no-auth.guard';
import { LoginComponent } from '@app/auth/login/login.component';

export const ROUTES: Routes = [
  {
    path: '',
    canActivate: [noAuthGuard],
    children: [
      {
        path: 'login',
        component: LoginComponent
      },
      { path: '', pathMatch: 'full', redirectTo: 'login' }
    ]
  }
];
