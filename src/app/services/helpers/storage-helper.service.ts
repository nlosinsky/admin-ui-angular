import { Injectable } from '@angular/core';
import { Token } from '@app/shared/models/auth';
import { LocalStorageService } from 'ngx-webstorage';

enum StorageKeys {
  TOKEN_DATA = 'token'
}

@Injectable({
  providedIn: 'root'
})
export class StorageHelperService {
  constructor(private storage: LocalStorageService) {}

  setTokenData(token: Token): void {
    this.storage.store(StorageKeys.TOKEN_DATA, token);
  }

  getTokenData(): Token {
    return this.storage.retrieve(StorageKeys.TOKEN_DATA) as Token;
  }

  clear(): void {
    this.storage.clear();
  }
}
