import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BgSpinnerModule } from '@components/bg-spinner/bg-spinner.component';
import { GeneralToolbarModule } from '@components/general-toolbar/general-toolbar.component';
import { ContractTypePipeModule } from '@pipes/contract-type/contract-type.pipe';
import { UsageTableComponent } from '@views/usage/table/usage-table.component';
import { UsageRoutingModule } from '@views/usage/usage-routing.module';
import { DxButtonModule, DxDataGridModule, DxTextBoxModule } from 'devextreme-angular';
import { QuicklinkModule } from 'ngx-quicklink';

@NgModule({
  declarations: [UsageTableComponent],
  imports: [
    CommonModule,
    UsageRoutingModule,
    GeneralToolbarModule,
    DxDataGridModule,
    DxButtonModule,
    DxTextBoxModule,
    ContractTypePipeModule,
    QuicklinkModule,
    BgSpinnerModule
  ]
})
export class UsageModule {}
