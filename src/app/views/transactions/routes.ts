import { Routes } from '@angular/router';

export const ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('@views/transactions/transactions-table.component').then(m => m.TransactionsTableComponent)
  }
];
