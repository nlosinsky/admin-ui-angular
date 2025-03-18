import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { AppLayoutComponent } from '@app/app-layout.component';
import { SidenavModule } from '@components/sidenav/sidenav.component';
import { ConstantDataHelperService } from '@services/helpers/constant-data-helper.service';
import { QuicklinkModule } from 'ngx-quicklink';
import dxDataGrid from 'devextreme/ui/data_grid';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { AuthModule } from './auth/auth.module';

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
  declarations: [AppComponent, AppLayoutComponent],
  imports: [
    BrowserModule,
    HttpClientModule,
    QuicklinkModule,
    AppRoutingModule,
    CoreModule.forRoot(),
    SidenavModule,
    AuthModule
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: constantDataResolveFactory,
      deps: [ConstantDataHelperService],
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
