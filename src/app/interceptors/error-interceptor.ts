import { HttpErrorResponse, HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { environment } from '@env/environment';
import { AuthService } from '@services/data/auth.service';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export const errorInterceptor = (request: HttpRequest<unknown>, next: HttpHandlerFn) => {
  const authService = inject(AuthService);

  if (!request.url.startsWith(environment.apiUrl)) {
    return next(request);
  }

  return next(request).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 || error.status === 403) {
        authService.logout(true);
      }

      return throwError(() => error);
    })
  );
};
