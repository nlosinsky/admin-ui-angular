import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { BgSpinnerModule } from '@components/bg-spinner/bg-spinner.component';
import { BooleanYesNoPipeModule } from '@pipes/boolean-yes-no/boolean-yes-no.pipe';
import { ErrorMessagePipeModule } from '@pipes/error-message/error-message.pipe';
import { StringValueCapitalizeModule } from '@pipes/string-value-capitalize/string-value-capitalize.pipe';
import { CompanyAddAccountComponent } from '@views/companies/company/accounts/add/company-add-account.component';
import { CompanyAccountsRoutingModule } from '@views/companies/company/accounts/company-accounts-routing.module';
import { CompanyAccountsComponent } from '@views/companies/company/accounts/company-accounts.component';
import {
  DxButtonModule,
  DxDataGridModule,
  DxNumberBoxModule,
  DxPopupModule,
  DxSelectBoxModule,
  DxTextAreaModule,
  DxTextBoxModule,
  DxTooltipModule,
  DxValidatorModule
} from 'devextreme-angular';
import { QuicklinkModule } from 'ngx-quicklink';

@NgModule({
  declarations: [CompanyAccountsComponent, CompanyAddAccountComponent],
  imports: [
    CommonModule,
    CompanyAccountsRoutingModule,
    DxDataGridModule,
    BgSpinnerModule,
    DxTooltipModule,
    BooleanYesNoPipeModule,
    StringValueCapitalizeModule,
    DxButtonModule,
    DxTextBoxModule,
    DxPopupModule,
    ReactiveFormsModule,
    ErrorMessagePipeModule,
    DxNumberBoxModule,
    DxTextAreaModule,
    DxSelectBoxModule,
    DxValidatorModule,
    QuicklinkModule
  ]
})
export class CompanyAccountsModule {}
