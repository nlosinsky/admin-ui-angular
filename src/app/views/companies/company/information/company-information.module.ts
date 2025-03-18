import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { BgSpinnerModule } from '@components/bg-spinner/bg-spinner.component';
import { StatusItemModule } from '@components/status-item/status-item.component';
import { ErrorMessagePipeModule } from '@pipes/error-message/error-message.pipe';
import { StatusColorModule } from '@pipes/status-color/status-color.pipe';
import { StringValueCapitalizeModule } from '@pipes/string-value-capitalize/string-value-capitalize.pipe';
import { CompanyInformationRoutingModule } from '@views/companies/company/information/company-information-routing.module';
import { CompanyInformationComponent } from '@views/companies/company/information/company-information.component';
import {
  DxButtonModule,
  DxDropDownButtonModule,
  DxSelectBoxModule,
  DxTextBoxModule,
  DxValidatorModule
} from 'devextreme-angular';
import { QuicklinkModule } from 'ngx-quicklink';

@NgModule({
  declarations: [CompanyInformationComponent],
  imports: [
    CommonModule,
    CompanyInformationRoutingModule,
    BgSpinnerModule,
    ReactiveFormsModule,
    DxTextBoxModule,
    ErrorMessagePipeModule,
    DxButtonModule,
    DxDropDownButtonModule,
    DxValidatorModule,
    DxSelectBoxModule,
    StringValueCapitalizeModule,
    StatusItemModule,
    StatusColorModule,
    QuicklinkModule
  ]
})
export class CompanyInformationModule {}
