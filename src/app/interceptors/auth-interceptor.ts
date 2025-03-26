import { HttpErrorResponse, HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { environment } from '@env/environment';
import { AuthService } from '@services/data/auth.service';
import { TokenHelperService } from '@services/helpers/token-helper.service';
import { EMPTY, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export function AuthInterceptor(request: HttpRequest<unknown>, next: HttpHandlerFn) {
  /* eslint-disable @typescript-eslint/no-explicit-any */
  if (!request.url.startsWith(environment.apiUrl) || request.url.endsWith('/auth/login')) {
    return next(request);
  }

  const tokenService = inject(TokenHelperService);
  const authService = inject(AuthService);

  if (!tokenService.isTokenValid) {
    authService.logout(true);
    return EMPTY;
  }

  return next(addToken(request, tokenService.accessToken)).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 || error.status === 403) {
        authService.logout(true);
        return EMPTY;
      }

      return throwError(() => error);
    })
  );

  function addToken(req: HttpRequest<any>, token: string): HttpRequest<any> {
    return req.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
  }
  /* eslint-enable @typescript-eslint/no-explicit-any */
}
