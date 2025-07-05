import { NgOptimizedImage } from '@angular/common';
import { Component, OnInit, ChangeDetectionStrategy, DestroyRef, inject, viewChildren, signal } from '@angular/core';
import { FormControl, FormGroup, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LoginCredentials } from '@app/shared/models';
import { FormHelper } from '@app/shared/utils/form-helper';
import { ErrorMessagePipe } from '@pipes/error-message/error-message.pipe';
import { AuthService } from '@services/data/auth.service';
import { DxButtonModule, DxTextBoxModule, DxValidatorComponent, DxValidatorModule } from 'devextreme-angular';
import { EMPTY } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

type LoginForm = {
  email: FormControl<string>;
  password: FormControl<string>;
};

@Component({
  selector: 'app-auth-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DxTextBoxModule, ReactiveFormsModule, DxButtonModule, ErrorMessagePipe, DxValidatorModule, NgOptimizedImage]
})
export class LoginComponent implements OnInit {
  private fb = inject(NonNullableFormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private destroyRef = inject(DestroyRef);

  readonly validators = viewChildren(DxValidatorComponent);

  form!: FormGroup<LoginForm>;
  isSubmitting = signal(false);
  errorMessage = signal('');

  ngOnInit(): void {
    this.initForm();
  }

  onValidateRule(fieldName: string) {
    return () => this.isValidField(fieldName);
  }

  isValidField(fieldName: string): boolean {
    const field = this.form.get(fieldName);
    return FormHelper.isValidField(field);
  }

  onLogin(event: Event): void {
    event.preventDefault();

    if (this.form.invalid) {
      FormHelper.triggerFormValidation(this.form, this.validators());
      return;
    }

    if (this.isSubmitting()) {
      return;
    }

    this.isSubmitting.set(true);
    this.errorMessage.set('');
    this.authService
      .login(this.form.value as LoginCredentials)
      .pipe(
        catchError(() => {
          this.errorMessage.set('Something unexpected happened, please try again.');
          return EMPTY;
        }),
        finalize(() => {
          this.isSubmitting.set(false);
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(() => {
        const url = this.route.snapshot.queryParamMap.get('returnUrl') || '/companies';
        this.router.navigateByUrl(url);
      });
  }

  private initForm(): void {
    this.form = this.fb.group({
      email: ['admin@example.com', [Validators.required, Validators.email]],
      password: ['admin', [Validators.required]]
    });
  }
}
