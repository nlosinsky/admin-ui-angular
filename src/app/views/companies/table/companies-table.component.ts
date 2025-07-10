import { DatePipe, DecimalPipe, formatDate } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  LOCALE_ID,
  OnInit,
  inject,
  viewChild,
  signal,
  computed
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { tableIndicatorSrc } from '@app/shared/constants';
import { ExportGridExcelCell, HttpError } from '@app/shared/models';
import { CompanyContractType } from '@app/shared/models/companies/company.enum';
import { TransformHelper } from '@app/shared/utils/transform-helper';
import { BgSpinnerComponent } from '@components/bg-spinner/bg-spinner.component';
import { GeneralToolbarComponent } from '@components/general-toolbar/general-toolbar.component';
import { ContractTypePipe } from '@pipes/contract-type/contract-type.pipe';
import { CompaniesService } from '@services/data/companies.service';
import { DataGridHelperService } from '@services/helpers/data-grid-helper.service';
import { DialogService } from '@services/helpers/dialog.service';
import { ToastService } from '@services/helpers/toast.service';
import { DxButtonComponent, DxDataGridComponent, DxTemplateDirective, DxTextBoxComponent } from 'devextreme-angular';
import {
  DxiColumnComponent,
  DxoColumnChooserComponent,
  DxoLoadPanelComponent,
  DxoPagingComponent,
  DxoScrollingComponent
} from 'devextreme-angular/ui/nested';
import { DataGridCell } from 'devextreme-angular/common/export/excel';
import { EMPTY, from, Subject } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, filter, finalize, mergeMap } from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-companies-table',
  templateUrl: './companies-table.component.html',
  styleUrls: ['./companies-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    GeneralToolbarComponent,
    DxButtonComponent,
    DxTextBoxComponent,
    DxDataGridComponent,
    DxoPagingComponent,
    DxoLoadPanelComponent,
    DxoScrollingComponent,
    DxiColumnComponent,
    DxTemplateDirective,
    RouterLink,
    DecimalPipe,
    DatePipe,
    ContractTypePipe,
    BgSpinnerComponent,
    DxoColumnChooserComponent
  ]
})
export class CompaniesTableComponent implements OnInit {
  private dataGridHelperService = inject(DataGridHelperService);
  private companiesService = inject(CompaniesService);
  private toastService = inject(ToastService);
  private dialogService = inject(DialogService);
  private localeId = inject(LOCALE_ID);
  private destroyRef = inject(DestroyRef);

  readonly dataGrid = viewChild.required(DxDataGridComponent);

  approveRequestsSet = signal(new Set<string>());
  declineRequestsSet = signal(new Set<string>());

  temporaryCompanies = this.companiesService.getTemporaryCompanies();
  companies = this.companiesService.getCompanies();
  isDataLoaded = computed(() => !(this.temporaryCompanies.isLoading() || this.companies.isLoading()));

  readonly indicatorSrc = tableIndicatorSrc;

  private searchSubj = new Subject<string>();

  ngOnInit(): void {
    this.handleSearch();
  }

  onShowColumnChooser(): void {
    this.dataGridHelperService.showColumnChooser(this.dataGrid());
  }

  // todo add decorator
  onDecline(id: string): void {
    if (this.declineRequestsSet().has(id)) {
      return;
    }

    from(this.dialogService.showConfirm('Do you want to Decline company?'))
      .pipe(
        filter(confirm => confirm),
        mergeMap(() => {
          this.declineRequestsSet.update(set => {
            const newSet = new Set(set);
            newSet.add(id);
            return newSet;
          });
          return this.companiesService.disapproveTemporaryCompany(id);
        }),
        catchError((error: HttpError) => {
          this.toastService.showHttpError(error);
          return EMPTY;
        }),
        finalize(() => {
          this.declineRequestsSet.update(set => {
            const newSet = new Set(set);
            newSet.delete(id);
            return newSet;
          });
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(() => {
        this.toastService.showSuccess('The company has been Declined successfully.');
        this.temporaryCompanies.update(temporaryCompanies => temporaryCompanies.filter(item => item.id !== id));
      });
  }

  // todo add decorator
  onApprove(id: string): void {
    if (this.approveRequestsSet().has(id)) {
      return;
    }

    this.approveRequestsSet.update(set => {
      const newSet = new Set(set);
      newSet.add(id);
      return newSet;
    });
    this.companiesService
      .approveTemporaryCompany(id)
      .pipe(
        catchError((error: HttpError) => {
          this.toastService.showHttpError(error);
          return EMPTY;
        }),
        finalize(() => {
          this.approveRequestsSet.update(set => {
            const newSet = new Set(set);
            newSet.delete(id);
            return newSet;
          });
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(() => {
        this.toastService.showSuccess('The company has been Approved successfully.');
        const approvedCompany = this.temporaryCompanies.value().find(item => item.id === id);

        if (!approvedCompany) {
          return;
        }
        this.temporaryCompanies.update(temporaryCompanies => temporaryCompanies.filter(item => item.id !== id));
        this.companies.update(companies => [approvedCompany, ...companies]);
      });
  }

  onExport(): void {
    this.dataGridHelperService.exportToExcel(
      this.dataGrid().instance,
      'customer_management',
      (gridCell: DataGridCell, excelCell: ExportGridExcelCell) => {
        const columnName = gridCell?.column?.name;

        if (!gridCell.value) {
          return;
        }

        if (columnName === 'createdAt') {
          const value = gridCell.value as string;
          excelCell.value = formatDate(value, 'shortDate', this.localeId);
          excelCell.alignment = { horizontal: 'right' };
        } else if (columnName === 'contract.type') {
          excelCell.value = TransformHelper.contractType(gridCell.value as CompanyContractType);
        } else if (columnName === 'contract.basisPoints') {
          const value = (gridCell.value || 0) / 100;
          excelCell.value = `${value}%`;
        }
      }
    );
  }

  onSearch(event: KeyboardEvent): void {
    this.searchSubj.next((event.target as HTMLInputElement).value);
  }

  private handleSearch(): void {
    this.searchSubj
      .asObservable()
      .pipe(distinctUntilChanged(), debounceTime(300), takeUntilDestroyed(this.destroyRef))
      .subscribe(val => {
        this.dataGrid().instance.searchByText(val);
      });
  }
}
