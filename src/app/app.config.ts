import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { ApplicationConfig, inject, provideAppInitializer, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withRouterConfig } from '@angular/router';
import { AuthInterceptor } from '@app/interceptors/auth-interceptor';
import { ConstantDataApiService } from '@services/api/constant-data-api.service';
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
      })
    ),
    provideAppInitializer(() => {
      const constantDataService = inject(ConstantDataApiService);
      return constantDataService.load();
    }),
    provideHttpClient(withInterceptors([AuthInterceptor]), withFetch()),
    provideClientHydration(withEventReplay())
  ]
};
