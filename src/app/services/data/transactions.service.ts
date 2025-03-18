import { Injectable } from '@angular/core';
import { TransactionsCount, TransactionsCountDTO } from '@app/shared/models/transactions';
import { TransactionsApiService } from '@services/api/transactions-api.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TransactionsService {
  constructor(private transactionsApiService: TransactionsApiService) {}

  getTransactionsCount(params: TransactionsCountDTO): Observable<TransactionsCount[]> {
    return this.transactionsApiService.getTransactionsCount(params);
  }
}
