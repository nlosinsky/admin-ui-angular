import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { APP_INITIALIZER, ApplicationConfig } from '@angular/core';
import { PreloadAllModules, provideRouter, withPreloading, withRouterConfig } from '@angular/router';
import { AuthInterceptor } from '@app/interceptors/auth-interceptor';
import { ConstantDataHelperService } from '@services/helpers/constant-data-helper.service';
import dxDataGrid from 'devextreme/ui/data_grid';
import { NgxWebstorageModule } from 'ngx-webstorage';
import { APP_ROUTES } from './app.routes';

function constantDataResolveFactory(provider: ConstantDataHelperService) {
  return () => provider.load();
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

//  todo refactor
export const appConfig: ApplicationConfig = {
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
};
