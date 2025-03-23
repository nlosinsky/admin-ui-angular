import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren
} from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Company, CompanyMember } from '@app/shared/models';
import {
  AggregationIntervalType,
  TickIntervalType,
  TransactionsCount,
  TransactionsSeries
} from '@app/shared/models/transactions';
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
import { QuicklinkModule } from 'ngx-quicklink';
import { of, Subject } from 'rxjs';
import { finalize, switchMap, takeUntil } from 'rxjs/operators';

export interface TransactionsForm {
  startDate: string;
  endDate: string;
  companyId?: string;
  userId?: string;
}

@Component({
  selector: 'app-transactions-table',
  templateUrl: './transactions-table.component.html',
  styleUrls: ['./transactions-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    CommonModule,
    DxDateBoxModule,
    ReactiveFormsModule,
    DxSelectBoxModule,
    DxValidatorModule,
    ErrorMessagePipe,
    DxChartModule,
    GeneralToolbarComponent,
    DxButtonModule,
    DxDropDownButtonModule,
    QuicklinkModule
  ]
})
export class TransactionsTableComponent implements OnInit, OnDestroy {
  @ViewChildren(DxValidatorComponent) validators!: QueryList<DxValidatorComponent>;
  @ViewChild(DxChartComponent, { static: false }) chart!: DxChartComponent;

  selectedSeriesValue: TransactionsSeries = TransactionsSeries.Daily;
  dataSource: TransactionsCount[] = [];
  companies: Company[] = [];
  companyMembers: CompanyMember[] = [{ fullName: 'All', id: '' } as CompanyMember];
  isSubmitting = false;
  form!: FormGroup;
  maxDate = new Date();
  tickInterval: TickIntervalType = '';
  aggregationInterval: AggregationIntervalType = 'day';

  readonly series = ObjectUtil.enumToKeyValueArray(TransactionsSeries);

  private ngUnsub = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private cd: ChangeDetectorRef,
    private transactionsTableService: TransactionsTableService
  ) {}

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
    this.aggregationInterval = this.transactionsTableService.getAggregationInterval(value);
  }

  onValidateRule(fieldName: string) {
    return () => this.isValidField(fieldName);
  }

  isValidField(fieldName: string): boolean {
    const field = this.form.get(fieldName);
    return FormHelper.isValidField(field);
  }

  onChartExport = (format = 'png') => this.transactionsTableService.onChartExport(this.chart, format);

  onSearch() {
    if (this.isSubmitting) {
      return;
    }

    if (this.form.invalid) {
      FormHelper.triggerFormValidation(this.form, this.validators);
      return;
    }

    this.isSubmitting = true;

    const payload = this.transactionsTableService.getSearchPayload(this.form.value as TransactionsForm);

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
    const endDate = this.form?.get('endDate')?.value as string;

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
    const config = {
      startDate: [new Date(), Validators.required],
      endDate: [new Date(), Validators.required],
      companyId: [''],
      userId: ['']
    };

    this.form = this.fb.group(config);
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
