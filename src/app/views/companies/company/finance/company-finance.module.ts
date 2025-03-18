import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AvatarBoxModule } from '@components/avatar-box/avatar-box.component';
import { BgSpinnerModule } from '@components/bg-spinner/bg-spinner.component';
import { CompanyFinanceRoutingModule } from '@views/companies/company/finance/company-finance-routing.module';
import { CompanyFinanceComponent } from '@views/companies/company/finance/company-finance.component';
import { QuicklinkModule } from 'ngx-quicklink';

@NgModule({
  declarations: [CompanyFinanceComponent],
  imports: [CommonModule, CompanyFinanceRoutingModule, AvatarBoxModule, BgSpinnerModule, QuicklinkModule]
})
export class CompanyFinanceModule {}
