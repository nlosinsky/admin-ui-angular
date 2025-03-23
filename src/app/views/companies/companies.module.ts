import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BgSpinnerComponent } from '@components/bg-spinner/bg-spinner.component';
import { GeneralToolbarComponent } from '@components/general-toolbar/general-toolbar.component';
import { ContractTypePipe } from '@pipes/contract-type/contract-type.pipe';
import { CompaniesTableComponent } from '@views/companies/table/companies-table.component';
import { DxButtonModule, DxDataGridModule, DxTextBoxModule } from 'devextreme-angular';
import { QuicklinkModule } from 'ngx-quicklink';

import { CompaniesRoutingModule } from './companies-routing.module';

@NgModule({
  declarations: [CompaniesTableComponent],
  imports: [
    CommonModule,
    CompaniesRoutingModule,
    GeneralToolbarComponent,
    DxDataGridModule,
    DxButtonModule,
    DxTextBoxModule,
    ContractTypePipe,
    QuicklinkModule,
    BgSpinnerComponent
  ]
})
export class CompaniesModule {}
