import { Injectable } from '@angular/core';
import { Company, HttpError, CompanyUpdateDTO, CompanyFeatures, CompanyContract } from '@app/shared/models';
import { CompaniesService } from '@services/data/companies.service';
import { ToastService } from '@services/helpers/toast.service';
import { EMPTY, Observable, ReplaySubject, Subject } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CompanyStateService {
  currentCompany$: Observable<Company | null>;
  currentCompany!: Company | null;

  private currentCompanySubj = new ReplaySubject<Company | null>(1);
  private loadCompanySubj = new Subject<string>();

  constructor(private companiesService: CompaniesService, private toastService: ToastService) {
    this.currentCompany$ = this.currentCompanySubj.asObservable();

    this.loadCompanySubj
      .asObservable()
      .pipe(
        switchMap((id: string) => {
          return this.getCompany(id).pipe(
            catchError((error: HttpError) => {
              this.toastService.showHttpError(error);
              return EMPTY;
            })
          );
        }),
        tap((company: Company) => this.setCurrentCompany(company))
      )
      .subscribe();
  }

  runCompanyLoad(id: string | null): void {
    if (!id) {
      return;
    }
    this.loadCompanySubj.next(id);
  }

  setCurrentCompany(company: Company | null): void {
    this.currentCompany = company;
    this.currentCompanySubj.next(company);
  }

  updateCurrentCompany(company: Partial<Company>): void {
    const data = new Company(Object.assign({}, this.currentCompany, company));
    this.setCurrentCompany(data);
  }

  resetCurrentCompany(): void {
    this.setCurrentCompany(null);
  }

  updateCompany(id: string, data: CompanyUpdateDTO): Observable<Company> {
    return this.companiesService.updateCompany(id, data).pipe(tap(resp => this.setCurrentCompany(resp)));
  }

  updateCompanyFeatures(id: string, featuresPayload: CompanyFeatures): Observable<Company> {
    return this.companiesService.updateCompanyFeatures(id, featuresPayload).pipe(
      tap(() => {
        const data = Object.assign({}, this.currentCompany, { features: featuresPayload });
        this.setCurrentCompany(new Company(data));
      })
    );
  }

  updateCompanyContract(id: string, contractPayload: CompanyContract): Observable<Company> {
    return this.companiesService.updateCompanyContract(id, contractPayload).pipe(
      tap(() => {
        const data = Object.assign({}, this.currentCompany, { contract: contractPayload });
        this.setCurrentCompany(new Company(data));
      })
    );
  }

  private getCompany(id: string): Observable<Company> {
    return this.companiesService.getCompany(id);
  }
}
