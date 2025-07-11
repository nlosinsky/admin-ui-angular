import { HttpErrorResponse } from '@angular/common/http';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  OnInit,
  inject,
  EventEmitter,
  viewChildren
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Account, AccountDTO, ObjectLike } from '@app/shared/models';
import { AccountNaturalBalanceEnum, AccountTypeEnum } from '@app/shared/models/accounts/account.enum';
import { FormHelper } from '@app/shared/utils/form-helper';
import { ObjectUtil } from '@app/shared/utils/object-util';
import { TransformHelper } from '@app/shared/utils/transform-helper';
import { ErrorMessagePipe } from '@pipes/error-message/error-message.pipe';
import { AccountsService } from '@services/data/accounts.service';
import { ToastService } from '@services/helpers/toast.service';
import { CompanyStateService } from '@views/companies/company/company-state.service';
import { DxPopupTypes } from 'devextreme-angular/ui/popup';
import DxPopup from 'devextreme/ui/popup';
import {
  DxButtonComponent,
  DxNumberBoxComponent,
  DxSelectBoxComponent,
  DxTextAreaComponent,
  DxTextBoxComponent,
  DxValidatorComponent
} from 'devextreme-angular';
import { DxiValidationRuleComponent } from 'devextreme-angular/ui/nested';
import { EMPTY } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';

type AccountForm = {
  name: FormControl<string>;
  number: FormControl<number>;
  naturalBalance: FormControl<string>;
  type: FormControl<string>;
  subtype: FormControl<string>;
  description: FormControl<string>;
  archived: FormControl<boolean>;
};

@Component({
  selector: 'app-company-add-account',
  templateUrl: 'company-add-account.component.html',
  styleUrls: ['./company-add-account.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    DxTextBoxComponent,
    DxiValidationRuleComponent,
    DxValidatorComponent,
    ErrorMessagePipe,
    DxNumberBoxComponent,
    DxTextAreaComponent,
    DxSelectBoxComponent,
    DxButtonComponent
  ]
})
export class CompanyAddAccountComponent implements OnInit {
  private fb = inject(NonNullableFormBuilder);
  private route = inject(ActivatedRoute);
  private destroyRef = inject(DestroyRef);
  private accountsService = inject(AccountsService);
  private toastService = inject(ToastService);
  private companyStateService = inject(CompanyStateService);
  private currentCompanyId = this.companyStateService.currentCompanyId;
  readonly validators = viewChildren(DxValidatorComponent);

  form!: FormGroup<AccountForm>;
  isSubmitting = false;

  private popupRef!: DxPopup<DxPopupTypes.Properties>;

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
  readonly closeEvent = new EventEmitter<Account | void>();

  ngOnInit() {
    this.initForm();
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

  onSave() {
    const companyId = this.currentCompanyId();

    if (this.isSubmitting || !companyId) {
      return;
    }

    if (this.form.invalid) {
      FormHelper.triggerFormValidation(this.form, this.validators());
      return;
    }

    this.isSubmitting = true;

    const value = this.form.value as ObjectLike;
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
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((data: Account) => {
        this.popupRef.hide();
        this.closeEvent.emit(data);
      });
  }

  onClose(): void {
    this.popupRef.hide();
    this.closeEvent.emit();
  }

  setPopupRef(ref: DxPopup<DxPopupTypes.Properties>) {
    this.popupRef = ref;
  }
}
