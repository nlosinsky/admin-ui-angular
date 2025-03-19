import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BgSpinnerModule } from '@components/bg-spinner/bg-spinner.component';
import { DetailsToolbarModule } from '@components/details-toolbar/details-toolbar.component';
import { CompanyRoutingModule } from '@views/companies/company/company-routing.module';
import { CompanyComponent } from '@views/companies/company/company.component';
import { DxButtonModule, DxDropDownButtonModule, DxTabsModule } from 'devextreme-angular';
import { QuicklinkModule } from 'ngx-quicklink';

@NgModule({
  declarations: [CompanyComponent],
  imports: [
    CommonModule,
    CompanyRoutingModule,
    DetailsToolbarModule,
    DxDropDownButtonModule,
    DxTabsModule,
    DxButtonModule,
    QuicklinkModule,
    BgSpinnerModule
  ]
})
export class CompanyModule {}
