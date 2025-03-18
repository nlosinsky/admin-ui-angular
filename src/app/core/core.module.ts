import { ModuleWithProviders, NgModule, Optional, SkipSelf } from '@angular/core';
import { NgxWebstorageModule } from 'ngx-webstorage';
// eslint-disable-next-line import/no-cycle
import { throwIfAlreadyLoaded } from './module-import-guard';

@NgModule({
  declarations: [],
  imports: [NgxWebstorageModule.forRoot({ prefix: 'angular-dashboard' })]
})
export class CoreModule {
  static forRoot(): ModuleWithProviders<CoreModule> {
    return {
      ngModule: CoreModule,
      providers: []
    };
  }

  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    throwIfAlreadyLoaded(parentModule, 'CoreModule');
  }
}
