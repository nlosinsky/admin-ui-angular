import { inject, Injectable, signal } from '@angular/core';
import { Company, CompanyContract, CompanyFeatures, CompanyUpdateDTO } from '@app/shared/models';
import { CompaniesService } from '@services/data/companies.service';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CompanyStateService {
  private companiesService = inject(CompaniesService);
  currentCompanyId = signal('');

  private _currentCompany = this.companiesService.getCompany(this.currentCompanyId);
  currentCompany = this._currentCompany.asReadonly();

  setCompanyId(id: string) {
    this.currentCompanyId.set(id);
  }

  setCurrentCompany(company: Company): void {
    this._currentCompany.set(company);
  }

  updateCurrentCompany(data: Partial<Company>): void {
    this._currentCompany.update(currentCompany => new Company(Object.assign({}, currentCompany, data)));
  }

  resetCurrentCompany(): void {
    this._currentCompany.set(null);
  }

  updateCompany(id: string, data: CompanyUpdateDTO): Observable<Company> {
    return this.companiesService.updateCompany(id, data).pipe(tap(resp => this.setCurrentCompany(resp)));
  }

  updateCompanyFeatures(id: string, featuresPayload: CompanyFeatures): Observable<Company> {
    return this.companiesService
      .updateCompanyFeatures(id, featuresPayload)
      .pipe(tap(() => this.updateCurrentCompany({ features: featuresPayload })));
  }

  updateCompanyContract(id: string, contractPayload: CompanyContract): Observable<Company> {
    return this.companiesService
      .updateCompanyContract(id, contractPayload)
      .pipe(tap(() => this.updateCurrentCompany({ contract: contractPayload })));
  }
}
