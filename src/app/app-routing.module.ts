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
      { path: '', pathMatch: 'full', redirectTo: 'companies' },
      {
        path: 'companies',
        loadChildren: () => import('./views/companies/companies.module').then(m => m.CompaniesModule)
      },
      {
        path: 'usage',
        loadChildren: () => import('./views/usage/routes').then(m => m.ROUTES)
      },
      {
        path: 'transactions',
        loadChildren: () => import('./views/transactions/routes').then(m => m.ROUTES)
      }
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
