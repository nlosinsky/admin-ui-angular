import { Routes } from '@angular/router';
import { NoAuthGuard } from '@app/auth/guards/no-auth.guard';
import { LoginComponent } from '@app/auth/login/login.component';

export const ROUTES: Routes = [
  {
    path: '',
    canActivate: [NoAuthGuard],
    children: [
      {
        path: 'login',
        component: LoginComponent
      },
      { path: '', pathMatch: 'full', redirectTo: 'login' }
    ]
  }
];
