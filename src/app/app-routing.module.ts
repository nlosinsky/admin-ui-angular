import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppLayoutComponent } from '@app/app-layout.component';
import { AuthGuard } from '@app/auth/guards/auth.guard';
import { QuicklinkStrategy } from 'ngx-quicklink';

const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./auth/routes').then(m => m.ROUTES)
  },
  {
    path: '',
    component: AppLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'companies',
        loadChildren: () => import('./views/companies/routes').then(m => m.ROUTES)
      },
      {
        path: 'usage',
        loadChildren: () => import('./views/usage/routes').then(m => m.ROUTES)
      },
      {
        path: 'transactions',
        loadChildren: () => import('./views/transactions/routes').then(m => m.ROUTES)
      },
      { path: '', pathMatch: 'full', redirectTo: 'companies' },
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      paramsInheritanceStrategy: 'always',
      preloadingStrategy: QuicklinkStrategy
    })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
