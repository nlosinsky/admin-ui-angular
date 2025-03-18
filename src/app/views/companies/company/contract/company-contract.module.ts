import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { BgSpinnerModule } from '@components/bg-spinner/bg-spinner.component';
import { ContractTypePipeModule } from '@pipes/contract-type/contract-type.pipe';
import { CompanyContractRoutingModule } from '@views/companies/company/contract/company-contract-routing.module';
import { CompanyContractComponent } from '@views/companies/company/contract/company-contract.component';
import {
  DxButtonModule,
  DxDropDownButtonModule,
  DxNumberBoxModule,
  DxSelectBoxModule,
  DxSwitchModule,
  DxTextBoxModule
} from 'devextreme-angular';
import { QuicklinkModule } from 'ngx-quicklink';

@NgModule({
  declarations: [CompanyContractComponent],
  imports: [
    CommonModule,
    CompanyContractRoutingModule,
    DxSwitchModule,
    ContractTypePipeModule,
    ReactiveFormsModule,
    DxSelectBoxModule,
    DxNumberBoxModule,
    DxTextBoxModule,
    BgSpinnerModule,
    DxButtonModule,
    DxDropDownButtonModule,
    QuicklinkModule
  ]
})
export class CompanyContractModule {}
