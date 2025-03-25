import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { tableIndicatorSrc } from '@app/shared/constants';
import { Account, ExportGridExcelCell } from '@app/shared/models';
import { CommonCustomerComponentActions } from '@app/shared/models/components';
import { TransformHelper } from '@app/shared/utils/transform-helper';
import { BgSpinnerComponent } from '@components/bg-spinner/bg-spinner.component';
import { BooleanYesNoPipe } from '@pipes/boolean-yes-no/boolean-yes-no.pipe';
import { StringValueCapitalizePipe } from '@pipes/string-value-capitalize/string-value-capitalize.pipe';
import { AccountsService } from '@services/data/accounts.service';
import { DataGridHelperService } from '@services/helpers/data-grid-helper.service';
import { DialogService } from '@services/helpers/dialog.service';
import { ToastService } from '@services/helpers/toast.service';
import { CompanyAddAccountComponent } from '@views/companies/company/accounts/add/company-add-account.component';
import {
  DxButtonModule,
  DxDataGridComponent,
  DxDataGridModule,
  DxTextBoxModule,
  DxTooltipComponent,
  DxTooltipModule,
} from 'devextreme-angular';
import { DataGridCell } from 'devextreme/excel_exporter';
import { EMPTY, Subject } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, finalize, takeUntil } from 'rxjs/operators';
import { on } from 'devextreme/events';
import { DxDataGridTypes } from "devextreme-angular/ui/data-grid"

@Component({
    selector: 'app-company-accounts',
    templateUrl: './company-accounts.component.html',
    styleUrls: ['./company-accounts.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        CommonModule,
        DxDataGridModule,
        BgSpinnerComponent,
        DxTooltipModule,
        StringValueCapitalizePipe,
        DxButtonModule,
        DxTextBoxModule,
        BooleanYesNoPipe
    ]
})
export class CompanyAccountsComponent implements OnInit, OnDestroy, AfterViewInit, CommonCustomerComponentActions {
  @ViewChild(DxTooltipComponent) tooltip!: DxTooltipComponent;
  @ViewChild(DxDataGridComponent) dataGrid!: DxDataGridComponent;
  @ViewChild('popupContainer', { read: ViewContainerRef }) private popupContainer!: ViewContainerRef;
  @ViewChild('actionsTpl', { read: TemplateRef }) actionsTpl!: TemplateRef<HTMLElement>;

  accounts: Account[] = [];
  isDataLoaded = false;
  actionsTemplateEvent = new EventEmitter<TemplateRef<HTMLElement>>();

  private searchSubj = new Subject<string>();
  readonly indicatorSrc = tableIndicatorSrc;
  private ngUnsub = new Subject<void>();

  constructor(
    private cd: ChangeDetectorRef,
    private accountsApiService: AccountsService,
    private toastService: ToastService,
    private route: ActivatedRoute,
    private dataGridHelperService: DataGridHelperService,
    private dialogService: DialogService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.handleSearch();
    this.loadData();
  }

  ngAfterViewInit() {
    this.actionsTemplateEvent.emit(this.actionsTpl);
  }

  ngOnDestroy(): void {
    this.ngUnsub.next();
    this.ngUnsub.complete();
  }

  navigateBack = () => this.router.navigate(['/companies']);

  loadData() {
    const companyId = this.route.snapshot.paramMap.get('companyId');
    if (!companyId) {
      return;
    }

    this.accountsApiService
      .getAccounts(companyId)
      .pipe(
        catchError(() => {
          this.toastService.showError();
          return EMPTY;
        }),
        finalize(() => {
          this.isDataLoaded = true;
          this.cd.markForCheck();
        }),
        takeUntil(this.ngUnsub)
      )
      .subscribe(accounts => {
        this.accounts = accounts;
      });
  }

  onCellPrepared(event: DxDataGridTypes.CellPreparedEvent) {
    if (!event.column.dataField) {
      return;
    }

    if (event.rowType === 'data' && ['name', 'description', 'subtype'].includes(event.column.dataField)) {
      on(event.cellElement, 'mouseover', (arg: { target: HTMLElement }) => {
        const key = event.column.dataField as keyof Account;
        const field = <string>event.data[key] || '';

        if (field?.length) {
          this.tooltip.contentTemplate = field;
          this.tooltip.instance.show(arg.target);
        }
      });

      on(event.cellElement, 'mouseout', () => {
        this.tooltip.contentTemplate = '';
        this.tooltip.instance.hide();
      });
    }
  }

  openColumnChooserButtonClick(): void {
    this.dataGridHelperService.openTableChooser(this.dataGrid);
  }

  onExport(): void {
    this.dataGridHelperService.exportToExcel(
      this.dataGrid.instance,
      'accounts',
      (gridCell: DataGridCell, excelCell: ExportGridExcelCell) => {
        const columnName = gridCell?.column?.name || '';

        if (columnName === 'archived') {
          excelCell.value = gridCell.value ? 'Yes' : 'No';
        } else if (['type', 'naturalBalance'].includes(columnName)) {
          excelCell.value = TransformHelper.stringValueCapitalize(gridCell.value);
        }
      }
    );
  }

  onAdd() {
    this.dialogService
      .openPopup(this.popupContainer, CompanyAddAccountComponent)
      .pipe(takeUntil(this.ngUnsub))
      .subscribe(refresh => {
        if (refresh) {
          this.loadData();
        }
      });
  }

  onSearch(event: KeyboardEvent): void {
    this.searchSubj.next((event.target as HTMLInputElement).value);
  }

  private handleSearch(): void {
    this.searchSubj
      .asObservable()
      .pipe(distinctUntilChanged(), debounceTime(300), takeUntil(this.ngUnsub))
      .subscribe(val => {
        this.dataGrid.instance.searchByText(val);
      });
  }
}
