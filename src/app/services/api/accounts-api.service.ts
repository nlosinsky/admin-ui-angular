import { HttpClient, httpResource } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Account, AccountDTO } from '@app/shared/models';
import { environment } from '@env/environment';
import { isArray } from 'lodash-es';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AccountsApiService {
  private http = inject(HttpClient);

  private readonly basePath = environment.apiUrl;

  getAccounts(companyId: string | null, limit = 1000, offset = 0) {
    return httpResource(
      () =>
        companyId
          ? {
              url: `${this.basePath}/accounts`,
              params: {
                limit,
                offset,
                companyId: companyId
              }
            }
          : undefined,
      {
        defaultValue: [],
        parse: (value: unknown) => (isArray(value) ? value.map(item => new Account(item)) : [])
      }
    );
  }

  addAccount(payload: AccountDTO): Observable<Account> {
    return this.http.post<Account>(`${this.basePath}/accounts`, payload).pipe(map(data => new Account(data)));
  }
}
