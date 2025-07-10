import { Injectable, inject } from '@angular/core';
import { Account, AccountDTO } from '@app/shared/models';
import { AccountsApiService } from '@services/api/accounts-api.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AccountsService {
  private accountsApiService = inject(AccountsApiService);

  addAccount(payload: AccountDTO): Observable<Account> {
    return this.accountsApiService.addAccount(payload);
  }

  getAccounts(companyId: string | null) {
    return this.accountsApiService.getAccounts(companyId);
  }
}
