import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { GeneralToolbarModule } from '@components/general-toolbar/general-toolbar.component';
import { ErrorMessagePipe } from '@pipes/error-message/error-message.pipe';
import { TransactionsTableComponent } from '@views/transactions/table/transactions-table.component';
import { TransactionsRoutingModule } from '@views/transactions/transactions-routing.module';
import {
  DxButtonModule,
  DxChartModule,
  DxDateBoxModule,
  DxDropDownButtonModule,
  DxSelectBoxModule,
  DxValidatorModule
} from 'devextreme-angular';
import { QuicklinkModule } from 'ngx-quicklink';

@NgModule({
  declarations: [TransactionsTableComponent],
  imports: [
    CommonModule,
    TransactionsRoutingModule,
    DxDateBoxModule,
    ReactiveFormsModule,
    DxSelectBoxModule,
    DxValidatorModule,
    ErrorMessagePipe,
    DxChartModule,
    GeneralToolbarModule,
    DxButtonModule,
    DxDropDownButtonModule,
    QuicklinkModule
  ]
})
export class TransactionsModule {}
