import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { PopupBaseComponent } from '@app/shared/base/popup.base';
import { AccountDTO, ObjectLike } from '@app/shared/models';
import { AccountNaturalBalanceEnum, AccountTypeEnum } from '@app/shared/models/accounts/account.enum';
import { FormHelper } from '@app/shared/utils/form-helper';
import { ObjectUtil } from '@app/shared/utils/object-util';
import { TransformHelper } from '@app/shared/utils/transform-helper';
import { ErrorMessagePipe } from '@pipes/error-message/error-message.pipe';
import { AccountsService } from '@services/data/accounts.service';
import { ToastService } from '@services/helpers/toast.service';
import {
  DxNumberBoxModule,
  DxPopupModule,
  DxSelectBoxModule,
  DxTextAreaModule,
  DxTextBoxModule,
  DxToolbarModule,
  DxValidatorModule
} from 'devextreme-angular';
import { EMPTY, Subject } from 'rxjs';
import { catchError, finalize, takeUntil } from 'rxjs/operators';

interface AccountForm {
  name: FormControl<string>;
  number: FormControl<number>;
  naturalBalance: FormControl<string>;
  type: FormControl<string>;
  subtype: FormControl<string>;
  description: FormControl<string>;
  archived: FormControl<boolean>;
}

@Component({
  selector: 'app-company-add-account',
  templateUrl: 'company-add-account.component.html',
  styleUrls: ['./company-add-account.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    DxTextBoxModule,
    DxPopupModule,
    ReactiveFormsModule,
    ErrorMessagePipe,
    DxNumberBoxModule,
    DxTextAreaModule,
    DxSelectBoxModule,
    DxValidatorModule,
    DxToolbarModule
  ]
})
export class CompanyAddAccountComponent extends PopupBaseComponent implements OnInit, OnDestroy {
  private fb = inject(NonNullableFormBuilder);
  private route = inject(ActivatedRoute);
  private accountsService = inject(AccountsService);
  private toastService = inject(ToastService);

  form!: FormGroup<AccountForm>;
  cancelButtonOptions!: unknown;
  saveButtonOptions!: unknown;
  isSubmitting = false;

  readonly accountTypes = ObjectUtil.enumToArray(AccountTypeEnum).map(value => {
    return { label: TransformHelper.stringValueCapitalize(value), value };
  });
  readonly naturalBalances = ObjectUtil.enumToArray(AccountNaturalBalanceEnum).map(value => {
    return { label: TransformHelper.stringValueCapitalize(value), value };
  });
  readonly inactiveTypes = [
    { label: 'Yes', value: true },
    { label: 'No', value: false }
  ];

  private ngUnsub = new Subject<void>();

  ngOnInit() {
    this.initButtons();
    this.initForm();
  }

  ngOnDestroy(): void {
    this.ngUnsub.next();
    this.ngUnsub.complete();
  }

  isValidField(fieldName: string): boolean {
    const field = this.form.get(fieldName);
    return FormHelper.isValidField(field);
  }

  onValidateRule(fieldName: string) {
    return () => this.isValidField(fieldName);
  }

  private initForm() {
    const config = {
      name: this.fb.control('', [Validators.required, Validators.maxLength(150)]),
      number: this.fb.control(0, [Validators.required, Validators.min(0), Validators.max(100000)]),
      naturalBalance: this.fb.control('', [Validators.required]),
      type: this.fb.control('', [Validators.required]),
      subtype: this.fb.control('', [Validators.maxLength(200)]),
      description: this.fb.control('', [Validators.maxLength(500)]),
      archived: this.fb.control(false)
    };
    this.form = this.fb.group(config);
  }

  private initButtons() {
    this.cancelButtonOptions = {
      text: 'Cancel',
      stylingMode: 'outlined',
      elementAttr: { class: 'grayed' },
      disabled: this.isSubmitting,
      onClick: () => this.close()
    };

    this.saveButtonOptions = {
      text: 'Save',
      type: 'success',
      disabled: this.isSubmitting,
      onClick: () => this.save()
    };
  }

  protected override close(data: boolean | void) {
    this.popupElem().instance.hide();
    super.close(data);
  }

  private save() {
    if (this.isSubmitting) {
      return;
    }

    if (this.form.invalid) {
      FormHelper.triggerFormValidation(this.form, this.validators());
      return;
    }

    this.isSubmitting = true;

    const value = this.form.value as ObjectLike;
    const companyId = this.route.snapshot.paramMap.get('companyId') as string;
    let payload = ObjectUtil.deleteEmptyProperties(value) as unknown as AccountDTO;
    payload.name = payload.name.trim();

    payload = { ...payload, companyId };

    this.accountsService
      .addAccount(payload)
      .pipe(
        catchError(({ error }: HttpErrorResponse) => {
          const errorMessage = (error as { message: string }).message;
          const message =
            errorMessage === 'Duplicate entry.'
              ? 'The provided name or number has already been used. Please provide another.'
              : errorMessage;

          this.toastService.showError(message);
          return EMPTY;
        }),
        finalize(() => (this.isSubmitting = false)),
        takeUntil(this.ngUnsub)
      )
      .subscribe(() => {
        this.close(true);
      });
  }
}
