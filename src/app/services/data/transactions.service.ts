import { Injectable, inject } from '@angular/core';
import { TransactionsCount, TransactionsFormValue } from '@app/shared/models/transactions';
import { TransactionsApiService } from '@services/api/transactions-api.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TransactionsService {
  private transactionsApiService = inject(TransactionsApiService);

  getTransactionsCount(params: TransactionsFormValue): Observable<TransactionsCount[]> {
    return this.transactionsApiService.getTransactionsCount(params);
  }
}
