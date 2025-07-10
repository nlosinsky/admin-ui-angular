import { httpResource, HttpResourceRef } from '@angular/common/http';
import { Injectable, Signal } from '@angular/core';
import { TransactionsCount, TransactionsSearchParamsValue } from '@app/shared/models/transactions';
import { environment } from '@env/environment';
import { addMilliseconds, subMilliseconds } from 'date-fns';
import { isArray } from 'lodash-es';

@Injectable({
  providedIn: 'root'
})
export class TransactionsApiService {
  private readonly basePath = environment.apiUrl;

  getTransactionsCount(params: Signal<TransactionsSearchParamsValue | null>): HttpResourceRef<TransactionsCount[]> {
    return httpResource(
      () => {
        return params()
          ? { url: `${this.basePath}/transactions`, params: JSON.parse(JSON.stringify(params())) }
          : undefined;
      },
      {
        defaultValue: [],
        parse: (value: unknown): TransactionsCount[] => this.formatTransactionsCountResponse(value)
      }
    );
  }

  private formatTransactionsCountResponse(items: unknown): TransactionsCount[] {
    if (!isArray(items)) {
      return [];
    }

    if (items.length !== 1) {
      return items;
    }

    const item = items[0];
    const date = new Date(item.date);
    const fakeDate = date.getMilliseconds() > 1 ? subMilliseconds(date, 1) : addMilliseconds(date, 1);

    return [item].concat({ count: 0, date: fakeDate.toISOString(), companyId: '', userId: '' });
  }
}
