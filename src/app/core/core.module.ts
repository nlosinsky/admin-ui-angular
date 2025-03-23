import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { APP_INITIALIZER, ModuleWithProviders, NgModule, Optional, SkipSelf } from '@angular/core';
import { AuthInterceptorService } from '@app/interceptors/auth-interceptor.service';
import { ConstantDataHelperService } from '@services/helpers/constant-data-helper.service';
import dxDataGrid from 'devextreme/ui/data_grid';
import { NgxWebstorageModule } from 'ngx-webstorage';
import { throwIfAlreadyLoaded } from './module-import-guard';

export function constantDataResolveFactory(provider: ConstantDataHelperService) {
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

@NgModule({
  declarations: [],
  imports: [NgxWebstorageModule.forRoot({ prefix: 'angular-dashboard' })]
})
export class CoreModule {
  static forRoot(): ModuleWithProviders<CoreModule> {
    return {
      ngModule: CoreModule,
      providers: [
        {
          provide: APP_INITIALIZER,
          useFactory: constantDataResolveFactory,
          deps: [ConstantDataHelperService],
          multi: true
        },
        { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptorService, multi: true }
      ]
    };
  }

  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    throwIfAlreadyLoaded(parentModule, 'CoreModule');
  }
}
