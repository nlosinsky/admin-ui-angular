import { ChangeDetectionStrategy, Component, DestroyRef, OnInit, TemplateRef, inject, viewChild } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { tableIndicatorSrc } from '@app/shared/constants';
import { Account, ExportGridExcelCell } from '@app/shared/models';
import { CommonCustomerComponentActions, TabWithActions } from '@app/shared/models/components';
import { TransformHelper } from '@app/shared/utils/transform-helper';
import { BgSpinnerComponent } from '@components/bg-spinner/bg-spinner.component';
import { BooleanYesNoPipe } from '@pipes/boolean-yes-no/boolean-yes-no.pipe';
import { StringValueCapitalizePipe } from '@pipes/string-value-capitalize/string-value-capitalize.pipe';
import { AccountsService } from '@services/data/accounts.service';
import { DataGridHelperService } from '@services/helpers/data-grid-helper.service';
import { DialogService } from '@services/helpers/dialog.service';
import { CompanyAddAccountComponent } from '@views/companies/company/accounts/add/company-add-account.component';
import { CompanyStateService } from '@views/companies/company/company-state.service';
import {
  DxButtonComponent,
  DxDataGridComponent,
  DxTemplateDirective,
  DxTextBoxComponent,
  DxTooltipComponent
} from 'devextreme-angular';
import {
  DxiColumnComponent,
  DxoColumnChooserComponent,
  DxoLoadPanelComponent,
  DxoPagingComponent,
  DxoScrollingComponent
} from 'devextreme-angular/ui/nested';
import { DataGridCell } from 'devextreme-angular/common/export/excel';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { on } from 'devextreme/events';
import { DxDataGridTypes } from 'devextreme-angular/ui/data-grid';

@Component({
  selector: 'app-company-accounts',
  templateUrl: './company-accounts.component.html',
  styleUrls: ['./company-accounts.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    DxButtonComponent,
    DxTextBoxComponent,
    DxDataGridComponent,
    DxoPagingComponent,
    DxoLoadPanelComponent,
    DxoScrollingComponent,
    DxiColumnComponent,
    DxTemplateDirective,
    BooleanYesNoPipe,
    StringValueCapitalizePipe,
    DxTooltipComponent,
    BgSpinnerComponent,
    DxoColumnChooserComponent
  ]
})
export class CompanyAccountsComponent implements OnInit, TabWithActions, CommonCustomerComponentActions {
  private destroyRef = inject(DestroyRef);
  private accountsApiService = inject(AccountsService);
  private dataGridHelperService = inject(DataGridHelperService);
  private companyStateService = inject(CompanyStateService);
  private dialogService = inject(DialogService);
  private router = inject(Router);

  readonly tooltip = viewChild.required(DxTooltipComponent);
  readonly dataGrid = viewChild.required(DxDataGridComponent);
  readonly actionsTpl = viewChild.required('actionsTpl', { read: TemplateRef<HTMLElement> });

  readonly currentCompanyId = this.companyStateService.currentCompanyId;

  readonly accounts = this.accountsApiService.getAccounts(this.currentCompanyId());

  private searchSubj = new Subject<string>();

  readonly indicatorSrc = tableIndicatorSrc;

  ngOnInit(): void {
    this.handleSearch();
  }

  navigateBack = () => this.router.navigate(['/companies']);

  onCellPrepared(event: DxDataGridTypes.CellPreparedEvent) {
    if (!event.column.dataField) {
      return;
    }

    if (event.rowType === 'data' && ['name', 'description', 'subtype'].includes(event.column.dataField)) {
      on(event.cellElement, 'mouseover', (arg: { target: HTMLElement }) => {
        const key = event.column.dataField as keyof Account;
        const field = (event.data[key] as string) || '';

        if (field?.length) {
          const tooltip = this.tooltip();
          tooltip.contentTemplate = field;
          tooltip.instance.show(arg.target);
        }
      });

      on(event.cellElement, 'mouseout', () => {
        const tooltip = this.tooltip();
        tooltip.contentTemplate = '';
        tooltip.instance.hide();
      });
    }
  }

  onShowColumnChooser(): void {
    this.dataGridHelperService.showColumnChooser(this.dataGrid());
  }

  onExport(): void {
    this.dataGridHelperService.exportToExcel(
      this.dataGrid().instance,
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
      .openPopup(CompanyAddAccountComponent, { title: 'Add Account' })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(newAccount => {
        if (!newAccount) {
          return;
        }
        this.accounts.update(accounts => [newAccount, ...accounts]);
      });
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
