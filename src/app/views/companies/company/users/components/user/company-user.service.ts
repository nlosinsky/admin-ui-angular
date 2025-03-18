import { Injectable } from '@angular/core';
import { HttpError, User } from '@app/shared/models';
import { CompaniesService } from '@services/data/companies.service';
import { ToastService } from '@services/helpers/toast.service';
import { EMPTY, Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CompanyUserService {
  constructor(private companiesService: CompaniesService, private toastService: ToastService) {}

  getData(companyId: string, memberId: string): Observable<User | null> {
    if (!companyId || !memberId) {
      return of(null);
    }

    return this.companiesService.getMemberById(companyId, memberId).pipe(
      catchError((error: HttpError) => {
        this.toastService.showHttpError(error);
        return EMPTY;
      })
    );
  }
}
