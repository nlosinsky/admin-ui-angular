import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TransactionsTableComponent } from '@views/transactions/table/transactions-table.component';

const routes: Routes = [
  {
    path: '',
    component: TransactionsTableComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TransactionsRoutingModule {}
