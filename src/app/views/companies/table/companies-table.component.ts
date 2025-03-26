import { DatePipe, DecimalPipe, formatDate, NgClass, NgForOf, NgIf } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Inject,
  LOCALE_ID,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';
import { RouterModule } from '@angular/router';
import { tableIndicatorSrc } from '@app/shared/constants';
import { Company, ExportGridExcelCell, HttpError } from '@app/shared/models';
import { CompanyContractType } from '@app/shared/models/companies/company.enum';
import { TransformHelper } from '@app/shared/utils/transform-helper';
import { BgSpinnerComponent } from '@components/bg-spinner/bg-spinner.component';
import { GeneralToolbarComponent } from '@components/general-toolbar/general-toolbar.component';
import { ContractTypePipe } from '@pipes/contract-type/contract-type.pipe';
import { CompaniesService } from '@services/data/companies.service';
import { DataGridHelperService } from '@services/helpers/data-grid-helper.service';
import { DialogService } from '@services/helpers/dialog.service';
import { ToastService } from '@services/helpers/toast.service';
import { DxButtonModule, DxDataGridComponent, DxDataGridModule, DxTextBoxModule } from 'devextreme-angular';
import { DataGridCell } from 'devextreme/excel_exporter';
import { EMPTY, forkJoin, from, Subject } from 'rxjs';
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  filter,
  finalize,
  mergeMap,
  switchMap,
  takeUntil,
  tap
} from 'rxjs/operators';

@Component({
    selector: 'app-companies-table',
    templateUrl: './companies-table.component.html',
    styleUrls: ['./companies-table.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
      NgIf,
      NgClass,
      DatePipe,
      DecimalPipe,
      NgForOf,
        GeneralToolbarComponent,
        DxDataGridModule,
        DxButtonModule,
        DxTextBoxModule,
        ContractTypePipe,
        RouterModule,
        BgSpinnerComponent
    ]
})
export class CompaniesTableComponent implements OnInit, OnDestroy {
  @ViewChild(DxDataGridComponent) dataGrid!: DxDataGridComponent;

  companies!: Company[];
  temporaryCompanies!: Company[];
  approveRequestsSet = new Set<string>();
  declineRequestsSet = new Set<string>();
  isDataLoaded = false;

  readonly indicatorSrc = tableIndicatorSrc;

  private searchSubj = new Subject<string>();
  private ngUnsub = new Subject<void>();
  private reloadCompaniesSubj = new Subject<void>();

  constructor(
    private cd: ChangeDetectorRef,
    private dataGridHelperService: DataGridHelperService,
    private companiesService: CompaniesService,
    private toastService: ToastService,
    private dialogService: DialogService,
    @Inject(LOCALE_ID) private localeId: string
  ) {}

  ngOnInit(): void {
    this.handleSearch();
    this.handleReloadTableData();
    this.loadData();
  }

  ngOnDestroy(): void {
    this.ngUnsub.next();
    this.ngUnsub.complete();
  }

  openColumnChooserButtonClick(): void {
    this.dataGridHelperService.openTableChooser(this.dataGrid);
  }

  onDecline(id: string): void {
    if (this.declineRequestsSet.has(id)) {
      return;
    }

    from(this.dialogService.showConfirm('Do you want to Decline company?'))
      .pipe(
        filter(confirm => confirm),
        mergeMap(() => {
          this.declineRequestsSet.add(id);
          this.cd.markForCheck();
          return this.companiesService.disapproveTemporaryCompany(id);
        }),
        catchError((error: HttpError) => {
          this.toastService.showHttpError(error);
          return EMPTY;
        }),
        finalize(() => {
          this.declineRequestsSet.delete(id);
          this.cd.markForCheck();
        }),
        takeUntil(this.ngUnsub)
      )
      .subscribe(() => {
        this.temporaryCompanies = this.temporaryCompanies.filter(item => item.id !== id);
        this.toastService.showSuccess('The company has been Declined successfully.');
      });
  }

  onApprove(id: string): void {
    if (this.approveRequestsSet.has(id)) {
      return;
    }

    this.approveRequestsSet.add(id);
    this.companiesService
      .approveTemporaryCompany(id)
      .pipe(
        catchError((error: HttpError) => {
          this.toastService.showHttpError(error);
          return EMPTY;
        }),
        finalize(() => {
          this.approveRequestsSet.delete(id);
          this.cd.markForCheck();
        }),
        takeUntil(this.ngUnsub)
      )
      .subscribe(() => {
        this.reloadCompaniesSubj.next();
        this.temporaryCompanies = this.temporaryCompanies.filter(item => item.id !== id);
        this.toastService.showSuccess('The company has been Approved successfully.');
      });
  }

  onExport(): void {
    this.dataGridHelperService.exportToExcel(
      this.dataGrid.instance,
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

  trackByTmpCompany(index: number, company: Company): string {
    return company.id;
  }

  private handleReloadTableData() {
    this.reloadCompaniesSubj
      .asObservable()
      .pipe(
        tap(() => this.dataGrid.instance.beginCustomLoading('')),
        switchMap(() => this.companiesService.getCompanies()),
        catchError((error: HttpError) => {
          this.dataGrid.instance.endCustomLoading();
          this.toastService.showHttpError(error);
          return EMPTY;
        }),
        takeUntil(this.ngUnsub)
      )
      .subscribe(companies => {
        this.companies = companies;
        this.dataGrid.instance.endCustomLoading();
        this.cd.markForCheck();
      });
  }

  private handleSearch(): void {
    this.searchSubj
      .asObservable()
      .pipe(distinctUntilChanged(), debounceTime(300), takeUntil(this.ngUnsub))
      .subscribe(val => {
        this.dataGrid.instance.searchByText(val);
      });
  }

  private loadData() {
    forkJoin([this.companiesService.getCompanies(), this.companiesService.getTemporaryCompanies()])
      .pipe(
        catchError((error: HttpError) => {
          this.toastService.showHttpError(error);
          return EMPTY;
        }),
        finalize(() => {
          this.isDataLoaded = true;
          this.cd.markForCheck();
        }),
        takeUntil(this.ngUnsub)
      )
      .subscribe(([companies, temporaryCompanies]) => {
        this.temporaryCompanies = temporaryCompanies;
        this.companies = companies;
      });
  }
}
