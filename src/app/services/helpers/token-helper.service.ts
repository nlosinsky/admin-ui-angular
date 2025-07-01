import { Injectable, inject } from '@angular/core';
import { environment } from '@env/environment';
import { SsrCookieService } from 'ngx-cookie-service-ssr';

const TOKEN_KEY = environment.authCookieKey;

@Injectable({
  providedIn: 'root'
})
export class TokenHelperService {
  private cookieService = inject(SsrCookieService);

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
