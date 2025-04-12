import { Injectable } from '@angular/core';
import { SsrCookieService } from 'ngx-cookie-service-ssr';

const TOKEN_KEY = 'authToken';

@Injectable({
  providedIn: 'root'
})
export class TokenHelperService {
  constructor(private cookieService: SsrCookieService) {}

  getAuthCookie() {
    return this.cookieService.get(TOKEN_KEY);
  }

  hasCookie() {
    return this.cookieService.check(TOKEN_KEY);
  }

  clear() {
    this.cookieService.delete(TOKEN_KEY, '/');
  }
}
