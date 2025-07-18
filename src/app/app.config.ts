import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideCheckNoChangesConfig,
  provideZonelessChangeDetection
} from '@angular/core';
import { provideRouter, withEnabledBlockingInitialNavigation, withRouterConfig } from '@angular/router';
import { authInterceptor } from '@app/interceptors/auth-interceptor';
import { errorInterceptor } from '@app/interceptors/error-interceptor';
import { APP_ROUTES } from './app.routes';
import { provideClientHydration, withIncrementalHydration } from '@angular/platform-browser';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideCheckNoChangesConfig({ exhaustive: true, interval: 1000 }),
    provideRouter(
      APP_ROUTES,
      withRouterConfig({
        paramsInheritanceStrategy: 'always'
      }),
      withEnabledBlockingInitialNavigation()
    ),
    provideHttpClient(withInterceptors([authInterceptor, errorInterceptor]), withFetch()),
    provideClientHydration(withIncrementalHydration())
  ]
};
