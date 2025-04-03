import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { ApplicationConfig, inject, provideAppInitializer, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withRouterConfig } from '@angular/router';
import { AuthInterceptor } from '@app/interceptors/auth-interceptor';
import { ConstantDataHelperService } from '@services/helpers/constant-data-helper.service';
import dxDataGrid from 'devextreme/ui/data_grid';
import { firstValueFrom } from 'rxjs';
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
      const constantDataService = inject(ConstantDataHelperService);
      return firstValueFrom(constantDataService.load());
    }),
    provideHttpClient(withInterceptors([AuthInterceptor]), withFetch()),
    provideClientHydration(withEventReplay())
  ]
};
