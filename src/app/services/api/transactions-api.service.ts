import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TransactionsCount, TransactionsCountDTO } from '@app/shared/models/transactions';
import { environment } from '@env/environment';

@Injectable({
  providedIn: 'root'
})
export class TransactionsApiService {
  private readonly basePath = environment.baseAdminUrl;

  constructor(private http: HttpClient) {}

  //  todo
  getTransactionsCount(data: TransactionsCountDTO) {
    const params = JSON.parse(JSON.stringify(data)) as { [key: string]: string };
    return this.http.get<TransactionsCount[]>(`${this.basePath}/transactions/count`, { params });
  }
}
