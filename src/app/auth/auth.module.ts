import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
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
})
export class AuthModule {}
