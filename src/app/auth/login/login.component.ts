import { CommonModule } from '@angular/common';
import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  OnDestroy,
  ViewChildren,
  QueryList
} from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LoginCredentials } from '@app/shared/models';
import { FormHelper } from '@app/shared/utils/form-helper';
import { ErrorMessagePipe } from '@pipes/error-message/error-message.pipe';
import { AuthService } from '@services/data/auth.service';
import { DxButtonModule, DxTextBoxModule, DxValidatorComponent, DxValidatorModule } from 'devextreme-angular';
import { QuicklinkModule } from 'ngx-quicklink';
import { EMPTY, Subject } from 'rxjs';
import { catchError, finalize, takeUntil } from 'rxjs/operators';

@Component({
    selector: 'app-auth-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        CommonModule,
        DxTextBoxModule,
        ReactiveFormsModule,
        DxButtonModule,
        ErrorMessagePipe,
        DxValidatorModule,
        QuicklinkModule
    ]
})
export class LoginComponent implements OnInit, OnDestroy {
  @ViewChildren(DxValidatorComponent) validators!: QueryList<DxValidatorComponent>;

  form!: FormGroup;
  isSubmitting = false;
  errorMessage = '';

  private ngUnsub = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private cd: ChangeDetectorRef,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  ngOnDestroy(): void {
    this.ngUnsub.next();
    this.ngUnsub.complete();
  }

  onValidateRule(fieldName: string) {
    return () => this.isValidField(fieldName);
  }

  isValidField(fieldName: string): boolean {
    const field = this.form.get(fieldName);
    return FormHelper.isValidField(field);
  }

  onFormSubmit(event: Event): void {
    event.preventDefault();

    if (this.form.invalid) {
      FormHelper.triggerFormValidation(this.form, this.validators);
      return;
    }

    if (this.isSubmitting) {
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';
    this.authService
      .login(this.form.value as LoginCredentials)
      .pipe(
        catchError((errorMessage: string) => {
          this.errorMessage = errorMessage;
          return EMPTY;
        }),
        finalize(() => {
          this.isSubmitting = false;
          this.cd.markForCheck();
        }),
        takeUntil(this.ngUnsub)
      )
      .subscribe(() => {
        const url = this.route.snapshot.queryParamMap.get('returnUrl') || '/companies';
        this.router.navigateByUrl(url);
      });
  }

  private initForm(): void {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }
}
