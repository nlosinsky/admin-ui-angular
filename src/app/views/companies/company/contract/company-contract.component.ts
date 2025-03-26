import { NgClass, NgIf, NgTemplateOutlet } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewChild
} from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Company, CompanyContract, CompanyFeatures, HttpError } from '@app/shared/models';
import { CompanyContractEnum } from '@app/shared/models/companies/company.enum';
import { CommonCustomerComponentActions, Submittable } from '@app/shared/models/components';
import { ObjectUtil } from '@app/shared/utils/object-util';
import { BgSpinnerComponent } from '@components/bg-spinner/bg-spinner.component';
import { ContractTypePipe } from '@pipes/contract-type/contract-type.pipe';
import { ToastService } from '@services/helpers/toast.service';
import { CompanyStateService } from '@views/companies/company/company-state.service';
import {
  DxButtonModule,
  DxDropDownButtonModule,
  DxNumberBoxModule,
  DxSelectBoxModule,
  DxSwitchModule,
  DxTextBoxModule
} from 'devextreme-angular';
import { EMPTY, forkJoin, Observable, Subject } from 'rxjs';
import { catchError, filter, finalize, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-company-contract',
  templateUrl: './company-contract.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NgIf,
    NgClass,
    NgTemplateOutlet,
    DxSwitchModule,
    ContractTypePipe,
    ReactiveFormsModule,
    DxSelectBoxModule,
    DxNumberBoxModule,
    DxTextBoxModule,
    BgSpinnerComponent,
    DxButtonModule,
    DxDropDownButtonModule
  ]
})
export class CompanyContractComponent
  implements OnInit, OnDestroy, Submittable, CommonCustomerComponentActions, AfterViewInit
{
  @ViewChild('actionsTpl', { read: TemplateRef }) actionsTpl!: TemplateRef<HTMLElement>;

  isEditMode = false;
  isDataLoaded = false;
  company!: Company;
  form!: FormGroup;
  isSubmitting = false;
  companyContract = CompanyContractEnum;
  companyContractList: string[] = [];
  isReadonlyTransactionFee = false;
  minTransactionFeeValue = 0;
  actionsTemplateEvent = new EventEmitter<TemplateRef<HTMLElement>>();

  private ngUnsub = new Subject<void>();

  constructor(
    private companyStateService: CompanyStateService,
    private cd: ChangeDetectorRef,
    private fb: FormBuilder,
    private toastService: ToastService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadData();
    this.companyContractList = ObjectUtil.enumToArray(CompanyContractEnum);
  }

  ngAfterViewInit() {
    this.actionsTemplateEvent.emit(this.actionsTpl);
  }

  ngOnDestroy(): void {
    this.ngUnsub.next();
    this.ngUnsub.complete();
  }

  navigateBack = () => this.router.navigate(['/companies']);

  onCancelEdit() {
    this.restoreForm();
    this.isEditMode = false;
    this.verifyTransactionFeeConstraints();
  }

  onEdit = () => {
    this.isEditMode = true;
    this.verifyTransactionFeeConstraints();
    this.cd.markForCheck();
  };

  onSaveChanges() {
    if (!this.hasChangedData() && this.form.valid) {
      this.isEditMode = false;
      return;
    }

    if (!this.features || !this.contract) {
      return;
    }

    const obsArr: Observable<Company>[] = [];

    if (this.isFeaturesChanged) {
      obsArr.push(this.companyStateService.updateCompanyFeatures(this.company.id, this.features));
    }

    if (this.isContractChanged) {
      obsArr.push(this.companyStateService.updateCompanyContract(this.company.id, this.contract));
    }

    this.isSubmitting = true;

    forkJoin(obsArr)
      .pipe(
        catchError((error: HttpError) => {
          this.toastService.showHttpError(error);
          return EMPTY;
        }),
        finalize(() => {
          this.isSubmitting = false;
          this.cd.markForCheck();
        }),
        takeUntil(this.ngUnsub)
      )
      .subscribe(() => {
        this.toastService.showSuccess('Data has been updated successfully.');
        this.form.markAsPristine();
        this.isEditMode = false;
      });
  }

  hasChangedData(): boolean {
    return this.isFeaturesChanged || this.isContractChanged;
  }

  private get isFeaturesChanged(): boolean {
    return !ObjectUtil.isDeepEquals(this.company.features, this.features);
  }

  private get isContractChanged(): boolean {
    return !ObjectUtil.isDeepEquals(this.company.contract, this.contract);
  }

  get features(): CompanyFeatures | null {
    return this.form.get('features')?.value as CompanyFeatures;
  }

  get contract(): CompanyContract | null {
    return this.form.get('contract')?.value as CompanyContract;
  }

  get isDisabled(): boolean {
    return this.isSubmitting || !this.isEditMode;
  }

  onChangeType(): void {
    this.verifyTransactionFeeConstraints();
  }

  private verifyTransactionFeeConstraints() {
    if (!this.form) {
      return;
    }
    const type = this.contract?.type;

    this.isReadonlyTransactionFee = this.isDisabled || type === this.companyContract.FREE;
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

  loadData(): void {
    this.companyStateService.currentCompany$
      .pipe(
        catchError(() => EMPTY),
        filter(resp => !!(resp && resp.id)),
        takeUntil(this.ngUnsub)
      )
      .subscribe(data => {
        this.isDataLoaded = true;

        if (!data) {
          return;
        }

        this.company = data;
        this.setFormData(data);
        this.verifyTransactionFeeConstraints();
        this.cd.markForCheck();
      });
  }

  setFormData(data: Company): void {
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
    const { features, contract } = this.company;
    this.form.reset({ features, contract });
  }
}
