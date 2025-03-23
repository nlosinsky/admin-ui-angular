import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppLayoutComponent } from '@app/app-layout.component';
import { AuthGuard } from '@app/auth/guards/auth.guard';
import { QuicklinkStrategy } from 'ngx-quicklink';

const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule)
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
        loadComponent: () => import('./views/usage/usage-table.component').then(m => m.UsageTableComponent)
      },
      {
        path: 'transactions',
        loadChildren: () => import('./views/transactions/transactions.module').then(m => m.TransactionsModule)
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
