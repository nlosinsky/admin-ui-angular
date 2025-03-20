import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthInterceptorService } from '@app/auth/auth-interceptor.service';
import { AuthRoutingModule } from '@app/auth/auth-routing.module';
import { LoginComponent } from '@app/auth/login/login.component';
import { ErrorMessagePipeModule } from '@pipes/error-message/error-message.pipe';
import { DxButtonModule, DxTextBoxModule, DxValidatorModule } from 'devextreme-angular';
import { QuicklinkModule } from 'ngx-quicklink';

@NgModule({
  declarations: [LoginComponent],
  imports: [
    CommonModule,
    AuthRoutingModule,
    DxTextBoxModule,
    ReactiveFormsModule,
    DxButtonModule,
    ErrorMessagePipeModule,
    DxValidatorModule,
    QuicklinkModule
  ]
  // todo
  // providers: [{ provide: HTTP_INTERCEPTORS, useClass: AuthInterceptorService, multi: true }]
})
export class AuthModule {}
