import { Routes } from '@angular/router';
import { LoginComponent } from '@app/auth/login/login.component';

export const ROUTES: Routes = [
  {
    path: '',
    children: [
      {
        path: 'login',
        component: LoginComponent
      },
      { path: '', pathMatch: 'full', redirectTo: 'login' }
    ]
  }
];
