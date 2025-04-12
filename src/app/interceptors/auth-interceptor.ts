import { isPlatformBrowser } from '@angular/common';
import { HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { inject, PLATFORM_ID, REQUEST } from '@angular/core';
import { environment } from '@env/environment';

export const authInterceptor = (request: HttpRequest<unknown>, next: HttpHandlerFn) => {
  const platformId = inject(PLATFORM_ID);
  const isBrowser = isPlatformBrowser(platformId);

  if (!request.url.startsWith(environment.apiUrl)) {
    return next(request);
  }

  if (isBrowser) {
    request = request.clone({ withCredentials: true });
  }

  if (request.url.endsWith('/auth/login')) {
    return next(request);
  }

  if (!isBrowser) {
    const reqCookie = inject(REQUEST)?.headers?.get('cookie') || '';
    request = request.clone({
      setHeaders: {
        Cookie: reqCookie
      }
    });
  }

  return next(request);
};
