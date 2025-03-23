import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { AvatarBoxComponent } from '@components/avatar-box/avatar-box.component';
import { BgSpinnerComponent } from '@components/bg-spinner/bg-spinner.component';
import { StatusItemComponent } from '@components/status-item/status-item.component';
import { StringValueCapitalizePipe } from '@pipes/string-value-capitalize/string-value-capitalize.pipe';
import { StatusColorPipe } from '@pipes/status-color/status-color.pipe';
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
    AvatarBoxComponent,
    DxDataGridModule,
    DxButtonModule,
    StatusItemComponent,
    StringValueCapitalizePipe,
    BgSpinnerComponent,
    DxDropDownButtonModule,
    ReactiveFormsModule,
    DxSelectBoxModule,
    DxTextBoxModule,
    StatusColorPipe,
    DxCheckBoxModule,
    QuicklinkModule
  ]
})
export class CompanyUsersModule {}
