import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TransactionsCount, TransactionsCountDTO } from '@app/shared/models/transactions';
import { environment } from '@env/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TransactionsApiService {
  private readonly basePath = environment.baseAdminUrl;

  constructor(private http: HttpClient) {}

  getTransactionsCount({
    companyId,
    userId,
    endDate,
    startDate
  }: TransactionsCountDTO): Observable<TransactionsCount[]> {
    const params = {
      startDate: startDate?.toISOString(),
      endDate: endDate?.toISOString()
    };

    if (companyId) {
      params['companyId'] = companyId;
    }

    if (userId) {
      params['userId'] = userId;
    }

    return this.http.get<TransactionsCount[]>(`${this.basePath}/transactions`, { params });
  }
}
