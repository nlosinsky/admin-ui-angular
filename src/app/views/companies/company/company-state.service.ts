import { computed, inject, Injectable, signal } from '@angular/core';
import { Company, CompanyContract, CompanyFeatures, CompanyUpdateDTO, HttpError } from '@app/shared/models';
import { CompaniesService } from '@services/data/companies.service';
import { ToastService } from '@services/helpers/toast.service';
import { EMPTY, Observable, Subject } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CompanyStateService {
  private companiesService = inject(CompaniesService);
  private toastService = inject(ToastService);
  private loadCompanySubj = new Subject<string>();
  private _currentCompany = signal<Company | null>(null);

  currentCompany = this._currentCompany.asReadonly();
  currentCompanyId = computed(() => this.currentCompany()?.id || null);

  constructor() {
    this.loadCompanySubj
      .asObservable()
      .pipe(switchMap((id: string) => this.getCompany(id)))
      .subscribe((company: Company) => {
        this.setCurrentCompany(company);
      });
  }

  runCompanyLoad(id: string | null): void {
    if (!id) {
      this.resetCurrentCompany();
      return;
    }

    this.loadCompanySubj.next(id);
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

  private getCompany(id: string): Observable<Company> {
    return this.companiesService.getCompany(id).pipe(
      catchError((error: HttpError) => {
        this.toastService.showHttpError(error);
        return EMPTY;
      })
    );
  }
}
