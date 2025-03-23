import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { BgSpinnerModule } from '@components/bg-spinner/bg-spinner.component';
import { BooleanYesNoPipe } from '@pipes/boolean-yes-no/boolean-yes-no.pipe';
import { ErrorMessagePipe } from '@pipes/error-message/error-message.pipe';
import { StringValueCapitalizePipe } from '@pipes/string-value-capitalize/string-value-capitalize.pipe';
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
    StringValueCapitalizePipe,
    DxButtonModule,
    DxTextBoxModule,
    DxPopupModule,
    ReactiveFormsModule,
    ErrorMessagePipe,
    DxNumberBoxModule,
    DxTextAreaModule,
    DxSelectBoxModule,
    DxValidatorModule,
    QuicklinkModule,
    BooleanYesNoPipe
  ]
})
export class CompanyAccountsModule {}
