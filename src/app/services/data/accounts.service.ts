import { Injectable } from '@angular/core';
import { Account, AccountDTO } from '@app/shared/models';
import { AccountsApiService } from '@services/api/accounts-api.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AccountsService {
  constructor(private accountsApiService: AccountsApiService) {}

  addAccount(payload: AccountDTO): Observable<Account> {
    return this.accountsApiService.addAccount(payload);
  }

  getAccounts(companyId: string): Observable<Account[]> {
    return this.accountsApiService.getAccounts(companyId);
  }
}
