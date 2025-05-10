import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { TransactionsCount, TransactionsFormValue } from '@app/shared/models/transactions';
import { environment } from '@env/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TransactionsApiService {
  private http = inject(HttpClient);

  private readonly basePath = environment.apiUrl;

  getTransactionsCount({
    companyId,
    userId,
    endDate,
    startDate
  }: TransactionsFormValue): Observable<TransactionsCount[]> {
    const params = {
      startDate: startDate?.toISOString(),
      endDate: endDate?.toISOString(),
      companyId,
      userId
    };

    return this.http.get<TransactionsCount[]>(`${this.basePath}/transactions`, { params });
  }
}
