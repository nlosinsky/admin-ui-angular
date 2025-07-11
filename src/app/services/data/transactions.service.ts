import { Injectable, inject, Signal } from '@angular/core';
import { TransactionsSearchParamsValue } from '@app/shared/models/transactions';
import { TransactionsApiService } from '@services/api/transactions-api.service';

@Injectable({
  providedIn: 'root'
})
export class TransactionsService {
  private transactionsApiService = inject(TransactionsApiService);

  getTransactionsCount(params: Signal<TransactionsSearchParamsValue | null>) {
    return this.transactionsApiService.getTransactionsCount(params);
  }
}
