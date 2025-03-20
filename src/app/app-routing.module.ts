import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppLayoutComponent } from '@app/app-layout.component';
import { AuthGuard } from '@app/auth/guards/auth.guard';
import { QuicklinkStrategy } from 'ngx-quicklink';

const routes: Routes = [
  // TODO: make default route content eagerly-loaded
  {
    path: '',
    component: AppLayoutComponent,
    // todo
    // canActivate: [AuthGuard],
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'companies' },
      {
        path: 'companies',
        loadChildren: () => import('./views/companies/companies.module').then(m => m.CompaniesModule)
      },
      {
        path: 'usage',
        loadChildren: () => import('./views/usage/usage.module').then(m => m.UsageModule)
      },
      {
        path: 'transactions',
        loadChildren: () => import('./views/transactions/transactions.module').then(m => m.TransactionsModule)
      },
      // todo
      // {
      //   path: 'pending-users',
      //   loadChildren: () => import('./views/pending-users/pending-users.module').then(m => m.PendingUsersModule)
      // }
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
