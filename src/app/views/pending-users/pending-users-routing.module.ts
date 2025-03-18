import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PendingUsersTableComponent } from '@views/pending-users/table/pending-users-table.component';

const routes: Routes = [
  {
    path: '',
    component: PendingUsersTableComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PendingUsersRoutingModule {}
