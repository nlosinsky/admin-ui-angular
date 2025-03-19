import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { environment } from '@env/environment';
import { AuthService } from '@services/data/auth.service';
import { TokenHelperService } from '@services/helpers/token-helper.service';
import { EMPTY, Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

interface ServerError {
  code: string;
  message: string;
  status: number;
}

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {
  constructor(private injector: Injector) {}

  /* eslint-disable @typescript-eslint/no-explicit-any */
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!request.url.startsWith(environment.baseAdminUrl)) {
      return next.handle(request);
    }

    const tokenService = this.injector.get(TokenHelperService);
    const authService = this.injector.get(AuthService);

    if (!tokenService.isTokenValid) {
      authService.logout(true);
      return EMPTY;
    }

    return next.handle(this.addToken(request, tokenService.accessToken)).pipe(
      catchError((error: HttpErrorResponse) => {
        const { message } = error.error as ServerError;
        if (
          error.status === 401 ||
          (error.status === 403 && message.includes('authorized scope is insufficient')) ||
          (error.status === 404 && message.startsWith('The token for'))
        ) {
          authService.logout(true);
          return EMPTY;
        }

        return throwError(() => error);
      })
    );
  }

  private addToken(req: HttpRequest<any>, token: string): HttpRequest<any> {
    return req.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
  }
  /* eslint-enable @typescript-eslint/no-explicit-any */
}
