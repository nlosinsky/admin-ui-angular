import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  TemplateRef,
  inject,
  viewChild,
  effect,
  signal,
  computed
} from '@angular/core';
import { FormControl, FormGroup, NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Company, CompanyContract, CompanyFeatures, HttpError } from '@app/shared/models';
import { CompanyContractEnum, CompanyContractType } from '@app/shared/models/companies/company.enum';
import { CommonCustomerComponentActions, Submittable, TabWithActions } from '@app/shared/models/components';
import { ObjectUtil } from '@app/shared/utils/object-util';
import { BgSpinnerComponent } from '@components/bg-spinner/bg-spinner.component';
import { ContractTypePipe } from '@pipes/contract-type/contract-type.pipe';
import { ToastService } from '@services/helpers/toast.service';
import { CompanyStateService } from '@views/companies/company/company-state.service';
import {
  DxButtonComponent,
  DxDropDownButtonComponent,
  DxNumberBoxComponent,
  DxSelectBoxComponent,
  DxSwitchComponent,
  DxTemplateDirective,
  DxTextBoxComponent
} from 'devextreme-angular';
import { DxiItemComponent } from 'devextreme-angular/ui/nested';
import { EMPTY, forkJoin, Observable } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

type CompanyContractForm = {
  contract: FormGroup<{
    type: FormControl<CompanyContractType>;
    basisPoints: FormControl<number>;
  }>;
  features: FormGroup<{
    accounting: FormControl<boolean>;
    advancedReporting: FormControl<boolean>;
    marketData: FormControl<boolean>;
    onlineTransactions: FormControl<boolean>;
    contractInventory: FormControl<boolean>;
  }>;
};

@Component({
  selector: 'app-company-contract',
  templateUrl: './company-contract.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    DxButtonComponent,
    DxDropDownButtonComponent,
    DxiItemComponent,
    ReactiveFormsModule,
    DxSelectBoxComponent,
    ContractTypePipe,
    DxTemplateDirective,
    DxTextBoxComponent,
    DxNumberBoxComponent,
    DxSwitchComponent,
    NgTemplateOutlet,
    BgSpinnerComponent
  ]
})
export class CompanyContractComponent implements Submittable, TabWithActions, CommonCustomerComponentActions {
  private companyStateService = inject(CompanyStateService);
  private fb = inject(NonNullableFormBuilder);
  private toastService = inject(ToastService);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);

  readonly actionsTpl = viewChild.required('actionsTpl', { read: TemplateRef });

  currentCompany = this.companyStateService.currentCompany;
  currentCompanyId = this.companyStateService.currentCompanyId;

  isEditMode = signal(false);
  isSubmitting = signal(false);
  isDisabled = computed(() => this.isSubmitting() || !this.isEditMode());

  isReadonlyTransactionFee = false;
  minTransactionFeeValue = 0;
  form!: FormGroup<CompanyContractForm>;
  readonly companyContract = CompanyContractEnum;
  readonly companyContractList: string[] = ObjectUtil.enumToArray(CompanyContractEnum);

  constructor() {
    effect(() => {
      if (!this.form) {
        this.setFormData(this.currentCompany.value());
        this.verifyTransactionFeeConstraints();
      }
    });
  }

  navigateBack = () => this.router.navigate(['/companies']);

  onCancelEdit() {
    this.restoreForm();
    this.isEditMode.set(false);
    this.verifyTransactionFeeConstraints();
  }

  onEdit = () => {
    this.isEditMode.set(true);
    this.verifyTransactionFeeConstraints();
  };

  onSaveChanges() {
    const companyId = this.currentCompanyId();

    if (!companyId) {
      return;
    }

    if (!this.hasChangedData() && this.form.valid) {
      this.isEditMode.set(false);
      return;
    }

    if (!this.features || !this.contract) {
      return;
    }

    const obsArr: Observable<Company>[] = [];

    if (this.isFeaturesChanged) {
      obsArr.push(this.companyStateService.updateCompanyFeatures(companyId, this.features));
    }

    if (this.isContractChanged) {
      obsArr.push(this.companyStateService.updateCompanyContract(companyId, this.contract));
    }

    this.isSubmitting.set(true);

    forkJoin(obsArr)
      .pipe(
        catchError((error: HttpError) => {
          this.toastService.showHttpError(error);
          return EMPTY;
        }),
        finalize(() => {
          this.isSubmitting.set(false);
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(() => {
        this.toastService.showSuccess('Data has been updated successfully.');
        this.form.markAsPristine();
        this.isEditMode.set(false);
      });
  }

  hasChangedData(): boolean {
    return this.isFeaturesChanged || this.isContractChanged;
  }

  private get isFeaturesChanged(): boolean {
    return !ObjectUtil.isDeepEquals(this.currentCompany.value()?.features, this.features);
  }

  private get isContractChanged(): boolean {
    return !ObjectUtil.isDeepEquals(this.currentCompany.value()?.contract, this.contract);
  }

  get features(): CompanyFeatures | null {
    return this.form.get('features')?.value as CompanyFeatures;
  }

  get contract(): CompanyContract | null {
    return this.form.get('contract')?.value as CompanyContract;
  }

  onChangeType(): void {
    this.verifyTransactionFeeConstraints();
  }

  private verifyTransactionFeeConstraints() {
    if (!this.form) {
      return;
    }
    const type = this.contract?.type;

    this.isReadonlyTransactionFee = this.isDisabled() || type === this.companyContract.FREE;
    this.minTransactionFeeValue = type === this.companyContract.BP_ONLY ? 1 : 0;

    const basisPoints = this.form.get('contract.basisPoints');

    if (!basisPoints || !type) {
      return;
    }

    if (type === CompanyContractEnum.FREE) {
      basisPoints.setValue(0);
    } else if (type === CompanyContractEnum.BP_ONLY && +basisPoints.value < this.minTransactionFeeValue) {
      basisPoints.setValue(this.minTransactionFeeValue);
    }
  }

  setFormData(data: Company | null): void {
    if (!data) {
      return;
    }

    const { accounting, advancedReporting, marketData, onlineTransactions, contractInventory } = data.features;
    const { type, basisPoints } = data.contract;

    this.form = this.fb.group({
      contract: this.fb.group({
        type,
        basisPoints
      }),
      features: this.fb.group({
        accounting,
        advancedReporting,
        marketData,
        onlineTransactions,
        contractInventory
      })
    });
  }

  restoreForm(): void {
    const { features, contract } = this.currentCompany.value() || {};
    this.form.reset({ features, contract });
  }
}
