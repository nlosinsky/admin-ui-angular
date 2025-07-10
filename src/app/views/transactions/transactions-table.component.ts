import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  OnInit,
  inject,
  viewChildren,
  viewChild,
  signal,
  computed,
  effect
} from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Company } from '@app/shared/models';
import { TransactionsSearchParamsValue, TransactionsSeries } from '@app/shared/models/transactions';
import { FormHelper } from '@app/shared/utils/form-helper';
import { ObjectUtil } from '@app/shared/utils/object-util';
import { GeneralToolbarComponent } from '@components/general-toolbar/general-toolbar.component';
import { ErrorMessagePipe } from '@pipes/error-message/error-message.pipe';
import { TransactionsTableService } from '@views/transactions/transactions-table.service';
import {
  DxButtonComponent,
  DxChartComponent,
  DxDateBoxComponent,
  DxDropDownButtonComponent,
  DxSelectBoxComponent,
  DxValidatorComponent
} from 'devextreme-angular';
import {
  DxiItemComponent,
  DxiSeriesComponent,
  DxiValidationRuleComponent,
  DxiValueAxisComponent,
  DxoAggregationComponent,
  DxoArgumentAxisComponent,
  DxoLegendComponent,
  DxoTitleComponent,
  DxoTooltipComponent
} from 'devextreme-angular/ui/nested';
import { TimeInterval } from 'devextreme/common/charts';
import { isValid } from 'date-fns';

type TransactionsForm = {
  startDate: FormControl<Date>;
  endDate: FormControl<Date>;
  companyId: FormControl<string>;
  userId: FormControl<string>;
};

@Component({
  selector: 'app-transactions-table',
  templateUrl: './transactions-table.component.html',
  styleUrls: ['./transactions-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    GeneralToolbarComponent,
    ReactiveFormsModule,
    DxDateBoxComponent,
    DxValidatorComponent,
    DxiValidationRuleComponent,
    ErrorMessagePipe,
    DxSelectBoxComponent,
    DxChartComponent,
    DxiSeriesComponent,
    DxoAggregationComponent,
    DxoLegendComponent,
    DxoTooltipComponent,
    DxiValueAxisComponent,
    DxoTitleComponent,
    DxoArgumentAxisComponent,
    DxDropDownButtonComponent,
    DxiItemComponent,
    DxButtonComponent
  ]
})
export class TransactionsTableComponent implements OnInit {
  private destroyRef = inject(DestroyRef);
  private transactionsTableService = inject(TransactionsTableService);

  readonly validators = viewChildren(DxValidatorComponent);
  readonly chart = viewChild.required(DxChartComponent);

  companies = signal<Company[]>([]);
  searchParams = signal<TransactionsSearchParamsValue | null>(null);

  readonly dataSource = this.transactionsTableService.getTransactionsCount(this.searchParams);

  readonly maxDate = new Date();
  readonly series = ObjectUtil.enumToKeyValueArray(TransactionsSeries);

  selectedSeriesValue: TransactionsSeries = TransactionsSeries.Daily;
  tickInterval: TimeInterval = 'day';
  aggregationInterval: TimeInterval = 'day';
  form: FormGroup<TransactionsForm> = this.transactionsTableService.createForm();

  companyId = toSignal(this.form.controls.companyId.valueChanges, { initialValue: '' });
  companyMembers = this.transactionsTableService.getMembers(this.companyId);
  companyMembersWithAll = computed(() => [{ fullName: 'All', id: '' }, ...this.companyMembers.value()]);

  constructor() {
    effect(() => {
      if (!this.companyId()) {
        this.companyMembers.set([]);
      }

      this.form.get('userId')?.setValue('');
    });
  }

  ngOnInit(): void {
    this.loadCompanies();
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
    if (this.form.invalid) {
      FormHelper.triggerFormValidation(this.form, this.validators());
      return;
    }

    const formValue = this.form.value;
    const payload = this.transactionsTableService.getSearchParams(formValue);

    if (!isValid(new Date(payload.startDate)) || !isValid(new Date(payload.endDate))) {
      return;
    }

    this.searchParams.set(payload);
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
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(companies => {
        this.companies.set(companies);
      });
  }
}
