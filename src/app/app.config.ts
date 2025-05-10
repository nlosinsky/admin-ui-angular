import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withEnabledBlockingInitialNavigation, withRouterConfig } from '@angular/router';
import { authInterceptor } from '@app/interceptors/auth-interceptor';
import { errorInterceptor } from '@app/interceptors/error-interceptor';
import dxDataGrid from 'devextreme/ui/data_grid';
import { APP_ROUTES } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';

dxDataGrid.defaultOptions({
  options: {
    columnChooser: {
      mode: 'select',
      title: '',
      sortOrder: 'asc'
    }
  }
});

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(
      APP_ROUTES,
      withRouterConfig({
        paramsInheritanceStrategy: 'always'
      }),
      withEnabledBlockingInitialNavigation()
    ),
    provideHttpClient(withInterceptors([authInterceptor, errorInterceptor]), withFetch()),
    provideClientHydration(withEventReplay())
  ]
};
