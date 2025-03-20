import { Injectable } from '@angular/core';
import { CompanyMember, HttpError } from '@app/shared/models';
import { CompaniesService } from '@services/data/companies.service';
import { ToastService } from '@services/helpers/toast.service';
import { EMPTY, Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CompanyUserService {
  constructor(private companiesService: CompaniesService, private toastService: ToastService) {}

  getData(memberId: string): Observable<CompanyMember | null> {
    if (!memberId) {
      return of(null);
    }

    return this.companiesService.getMemberById(memberId).pipe(
      catchError((error: HttpError) => {
        this.toastService.showHttpError(error);
        return EMPTY;
      })
    );
  }
}
