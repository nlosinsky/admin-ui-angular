import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Company } from '@app/shared/models';
import { CompanyStateService } from '@views/companies/company/company-state.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-company-finance',
  templateUrl: './company-finance.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CompanyFinanceComponent implements OnInit {
  currentCompany$!: Observable<Company | null>;

  constructor(private companyStateService: CompanyStateService) {}

  ngOnInit(): void {
    this.currentCompany$ = this.companyStateService.currentCompany$;
  }
}
