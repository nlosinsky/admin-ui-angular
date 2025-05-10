import { NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  inject,
  viewChildren,
  viewChild
} from '@angular/core';
import { FormControl, FormGroup, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Company, CompanyMember } from '@app/shared/models';
import { TransactionsCount, TransactionsSeries } from '@app/shared/models/transactions';
import { FormHelper } from '@app/shared/utils/form-helper';
import { ObjectUtil } from '@app/shared/utils/object-util';
import { GeneralToolbarComponent } from '@components/general-toolbar/general-toolbar.component';
import { ErrorMessagePipe } from '@pipes/error-message/error-message.pipe';
import { TransactionsTableService } from '@views/transactions/transactions-table.service';
import { isValid } from 'date-fns';
import {
  DxButtonModule,
  DxChartComponent,
  DxChartModule,
  DxDateBoxModule,
  DxDropDownButtonModule,
  DxSelectBoxModule,
  DxValidatorComponent,
  DxValidatorModule
} from 'devextreme-angular';
import { of, Subject } from 'rxjs';
import { finalize, switchMap, takeUntil } from 'rxjs/operators';
import { TimeInterval } from 'devextreme/common/charts';

interface TransactionsForm {
  startDate: FormControl<Date>;
  endDate: FormControl<Date>;
  companyId: FormControl<string>;
  userId: FormControl<string>;
}

@Component({
  selector: 'app-transactions-table',
  templateUrl: './transactions-table.component.html',
  styleUrls: ['./transactions-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NgClass,
    DxDateBoxModule,
    ReactiveFormsModule,
    DxSelectBoxModule,
    DxValidatorModule,
    ErrorMessagePipe,
    DxChartModule,
    GeneralToolbarComponent,
    DxButtonModule,
    DxDropDownButtonModule
  ]
})
export class TransactionsTableComponent implements OnInit, OnDestroy {
  private fb = inject(NonNullableFormBuilder);
  private cd = inject(ChangeDetectorRef);
  private transactionsTableService = inject(TransactionsTableService);

  readonly validators = viewChildren(DxValidatorComponent);
  readonly chart = viewChild.required(DxChartComponent);

  selectedSeriesValue: TransactionsSeries = TransactionsSeries.Daily;
  dataSource: TransactionsCount[] = [];
  companies: Company[] = [];
  companyMembers: CompanyMember[] = [{ fullName: 'All', id: '' } as CompanyMember];
  isSubmitting = false;
  form!: FormGroup<TransactionsForm>;
  maxDate = new Date();
  tickInterval!: TimeInterval;
  aggregationInterval: TimeInterval = 'day';

  readonly series = ObjectUtil.enumToKeyValueArray(TransactionsSeries);

  private ngUnsub = new Subject<void>();

  ngOnInit(): void {
    this.loadCompanies();
    this.initForm();
    this.handleCountryChange();
  }

  ngOnDestroy(): void {
    this.ngUnsub.next();
    this.ngUnsub.complete();
  }

  customizeTooltip = (info: { valueText: string; argument: Date }) => {
    return this.transactionsTableService.customizeTooltip(this.selectedSeriesValue, info);
  };

  onChangeSeries(value: TransactionsSeries) {
    this.selectedSeriesValue = value;
    this.tickInterval = this.transactionsTableService.getTickInterval(value);
    this.aggregationInterval = this.transactionsTableService.getTickInterval(value);
  }

  onValidateRule(fieldName: string) {
    return () => this.isValidField(fieldName);
  }

  isValidField(fieldName: string): boolean {
    const field = this.form.get(fieldName);
    return FormHelper.isValidField(field);
  }

  onChartExport = (format = 'png') => this.transactionsTableService.onChartExport(this.chart(), format);

  onSearch() {
    if (this.isSubmitting) {
      return;
    }

    if (this.form.invalid) {
      FormHelper.triggerFormValidation(this.form, this.validators());
      return;
    }

    this.isSubmitting = true;

    const formValue = this.form.value;
    const payload = this.transactionsTableService.getSearchPayload(formValue);

    if (!isValid(new Date(payload.startDate)) || !isValid(new Date(payload.endDate))) {
      this.isSubmitting = false;
      return;
    }

    this.transactionsTableService
      .getTransactionsCount(payload)
      .pipe(
        finalize(() => {
          this.isSubmitting = false;
          this.cd.markForCheck();
        }),
        takeUntil(this.ngUnsub)
      )
      .subscribe(items => {
        this.dataSource = items;
      });
  }

  get maxStartDate() {
    const endDate = this.form?.get('endDate')?.value;

    if (endDate) {
      return new Date(endDate);
    }

    return new Date();
  }

  private loadCompanies() {
    this.transactionsTableService
      .getCompanies()
      .pipe(takeUntil(this.ngUnsub))
      .subscribe(companies => {
        this.companies = companies;
        this.cd.markForCheck();
      });
  }

  private initForm() {
    this.form = this.fb.group({
      startDate: [new Date(), Validators.required],
      endDate: [new Date(), Validators.required],
      companyId: [''],
      userId: ['']
    });
  }

  private handleCountryChange() {
    this.form
      .get('companyId')
      ?.valueChanges.pipe(
        switchMap((companyId: string) => {
          this.form.get('userId')?.setValue('');

          if (!companyId) {
            return of([]);
          }
          return this.transactionsTableService.getMembers(companyId);
        }),
        takeUntil(this.ngUnsub)
      )
      .subscribe(members => {
        this.companyMembers = members;
        this.cd.markForCheck();
      });
  }
}
