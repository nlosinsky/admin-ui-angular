import { Injectable } from '@angular/core';
import { Token } from '@app/shared/models/auth';
import { SsrCookieService } from 'ngx-cookie-service-ssr';

enum StorageKeys {
  TOKEN_DATA = 'token'
}

@Injectable({
  providedIn: 'root'
})
export class StorageHelperService {
  constructor(private cookieService: SsrCookieService) {}

  setTokenData(token: Token): void {
    this.cookieService.set(StorageKeys.TOKEN_DATA, JSON.stringify(token));
  }

  getTokenData(): Token {
    const token = this.cookieService.get(StorageKeys.TOKEN_DATA);

    if (!token) {
      return { accessToken: '' };
    }

    return JSON.parse(token);
  }

  clear(): void {
    this.cookieService.delete(StorageKeys.TOKEN_DATA);
  }
}
