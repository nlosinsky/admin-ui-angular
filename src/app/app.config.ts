import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { ApplicationConfig, inject, provideAppInitializer } from '@angular/core';
import { provideRouter, withRouterConfig } from '@angular/router';
import { AuthInterceptor } from '@app/interceptors/auth-interceptor';
import { ConstantDataHelperService } from '@services/helpers/constant-data-helper.service';
import dxDataGrid from 'devextreme/ui/data_grid';
import { provideNgxWebstorage, withLocalStorage, withNgxWebstorageConfig } from 'ngx-webstorage';
import { firstValueFrom } from 'rxjs';
import { APP_ROUTES } from './app.routes';

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
    provideRouter(
      APP_ROUTES,
      withRouterConfig({
        paramsInheritanceStrategy: 'always'
      }),
    ),
    provideNgxWebstorage(
      withNgxWebstorageConfig({prefix: 'angular-dashboard'}),
      withLocalStorage()
    ),
    provideAppInitializer(() => {
      const constantDataService = inject(ConstantDataHelperService);
      return firstValueFrom(constantDataService.load());
      }),
    provideHttpClient(
      withInterceptors([ AuthInterceptor ])
    )
  ]
};
