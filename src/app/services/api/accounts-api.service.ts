import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Account, AccountDTO } from '@app/shared/models';
import { environment } from '@env/environment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AccountsApiService {
  private readonly basePath = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getAccounts(companyId: string, limit = 1000, offset = 0): Observable<Account[]> {
    return this.http
      .get<Account[]>(`${this.basePath}/accounts`, {
        params: {
          limit,
          offset,
          companyId: companyId
        }
      })
      .pipe(map(resp => resp.map(item => new Account(item))));
  }

  addAccount(payload: AccountDTO): Observable<Account> {
    return this.http.post<Account>(`${this.basePath}/accounts`, payload).pipe(map(data => new Account(data)));
  }
}
