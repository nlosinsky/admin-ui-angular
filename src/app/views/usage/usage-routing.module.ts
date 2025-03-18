import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UsageTableComponent } from '@views/usage/table/usage-table.component';

const routes: Routes = [
  {
    path: '',
    component: UsageTableComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsageRoutingModule {}
