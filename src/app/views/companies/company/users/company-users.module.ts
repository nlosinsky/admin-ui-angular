import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { AvatarBoxModule } from '@components/avatar-box/avatar-box.component';
import { BgSpinnerModule } from '@components/bg-spinner/bg-spinner.component';
import { StatusItemModule } from '@components/status-item/status-item.component';
import { StringValueCapitalizeModule } from '@pipes/string-value-capitalize/string-value-capitalize.pipe';
import { StatusColorModule } from '@pipes/status-color/status-color.pipe';
import { CompanyUsersRoutingModule } from '@views/companies/company/users/company-users-routing.module';
import { CompanyUsersComponent } from '@views/companies/company/users/company-users.component';
import { CompanyUserComponent } from '@views/companies/company/users/components/user/company-user.component';
import {
  DxButtonModule,
  DxCheckBoxModule,
  DxDataGridModule,
  DxDropDownButtonModule,
  DxSelectBoxModule,
  DxTextBoxModule
} from 'devextreme-angular';
import { QuicklinkModule } from 'ngx-quicklink';

@NgModule({
  declarations: [CompanyUsersComponent, CompanyUserComponent],
  imports: [
    CommonModule,
    CompanyUsersRoutingModule,
    AvatarBoxModule,
    DxDataGridModule,
    DxButtonModule,
    StatusItemModule,
    StringValueCapitalizeModule,
    BgSpinnerModule,
    DxDropDownButtonModule,
    ReactiveFormsModule,
    DxSelectBoxModule,
    DxTextBoxModule,
    StatusColorModule,
    DxCheckBoxModule,
    QuicklinkModule
  ]
})
export class CompanyUsersModule {}
