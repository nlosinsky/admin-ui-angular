import { HttpClientModule } from '@angular/common/http';
import { BrowserModule, BrowserTransferStateModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppLayoutComponent } from '@app/app-layout.component';
import { SidenavModule } from '@components/sidenav/sidenav.component';
import { QuicklinkModule } from 'ngx-quicklink';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';

@NgModule({
  declarations: [AppComponent, AppLayoutComponent],
  imports: [
    BrowserModule,
    // todo remove
    BrowserTransferStateModule,
    HttpClientModule,
    QuicklinkModule,
    AppRoutingModule,
    CoreModule.forRoot(),
    SidenavModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
