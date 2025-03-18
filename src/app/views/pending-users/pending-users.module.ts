import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BgSpinnerModule } from '@components/bg-spinner/bg-spinner.component';
import { GeneralToolbarModule } from '@components/general-toolbar/general-toolbar.component';
import { StatusItemModule } from '@components/status-item/status-item.component';
import { StatusColorModule } from '@pipes/status-color/status-color.pipe';
import { StringValueCapitalizeModule } from '@pipes/string-value-capitalize/string-value-capitalize.pipe';
import { PendingUsersRoutingModule } from '@views/pending-users/pending-users-routing.module';
import { PendingUsersTableComponent } from '@views/pending-users/table/pending-users-table.component';
import { DxButtonModule, DxDataGridModule, DxDropDownButtonModule, DxTextBoxModule } from 'devextreme-angular';
import { QuicklinkModule } from 'ngx-quicklink';

@NgModule({
  declarations: [PendingUsersTableComponent],
  imports: [
    CommonModule,
    PendingUsersRoutingModule,
    QuicklinkModule,
    BgSpinnerModule,
    GeneralToolbarModule,
    DxButtonModule,
    DxTextBoxModule,
    DxDataGridModule,
    StatusItemModule,
    StringValueCapitalizeModule,
    StatusColorModule,
    DxDropDownButtonModule
  ]
})
export class PendingUsersModule {}
