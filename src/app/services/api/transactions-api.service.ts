import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TransactionsCount, TransactionsCountDTO } from '@app/shared/models/transactions';
import { environment } from '@env/environment';
import { isWithinInterval } from 'date-fns';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TransactionsApiService {
  private readonly basePath = environment.baseAdminUrl;

  constructor(private http: HttpClient) {}

  getTransactionsCount(data: TransactionsCountDTO): Observable<TransactionsCount[]> {
    const params = {};

    if (data.companyId) {
      params['companyId'] = data.companyId;
    }

    if (data.userId) {
      params['userId'] = data.userId;
    }

    return this.http.get<TransactionsCount[]>(`${this.basePath}/transactions`, {params})
      .pipe(
        map(resp => {
          return resp.filter(item => isWithinInterval(new Date(item.date), {start: data.startDate, end: data.endDate}));
        })
      )
  }
}
