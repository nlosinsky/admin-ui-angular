import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { APP_INITIALIZER, enableProdMode } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { PreloadAllModules, provideRouter, withPreloading, withRouterConfig } from '@angular/router';
import { AppComponent } from '@app/app.component';
import { AuthInterceptor } from '@app/interceptors/auth-interceptor';

import { environment } from '@env/environment';
import { ConstantDataHelperService } from '@services/helpers/constant-data-helper.service';
import dxDataGrid from 'devextreme/ui/data_grid';
import { NgxWebstorageModule } from 'ngx-webstorage';
import { APP_ROUTES } from './app/app-routes';

if (environment.production) {
  enableProdMode();
}

dxDataGrid.defaultOptions({
  options: {
    columnChooser: {
      mode: 'select',
      title: '',
      sortOrder: 'asc'
    }
  }
});

export function constantDataResolveFactory(provider: ConstantDataHelperService) {
  return () => provider.load();
}

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(
      APP_ROUTES,
      withRouterConfig({
        paramsInheritanceStrategy: 'always'
      }),
      // todo change
      withPreloading(PreloadAllModules)
    ),
    NgxWebstorageModule.forRoot({ prefix: 'angular-dashboard' }).providers as any, // todo change
    {
      provide: APP_INITIALIZER,
      useFactory: constantDataResolveFactory,
      deps: [ConstantDataHelperService],
      multi: true
    },
    provideHttpClient(
      withInterceptors([ AuthInterceptor ])
    )
  ]
});
