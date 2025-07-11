import { ChangeDetectionStrategy, Component, DestroyRef, OnInit, inject, viewChild } from '@angular/core';
import { tableIndicatorSrc } from '@app/shared/constants';
import { BgSpinnerComponent } from '@components/bg-spinner/bg-spinner.component';
import { GeneralToolbarComponent } from '@components/general-toolbar/general-toolbar.component';
import { DocumentsService } from '@services/data/documents.service';
import { DataGridHelperService } from '@services/helpers/data-grid-helper.service';
import { DxButtonComponent, DxDataGridComponent, DxTextBoxComponent } from 'devextreme-angular';
import {
  DxiColumnComponent,
  DxoColumnChooserComponent,
  DxoLoadPanelComponent,
  DxoPagingComponent,
  DxoScrollingComponent
} from 'devextreme-angular/ui/nested';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-usage-table',
  templateUrl: './usage-table.component.html',
  styleUrls: ['./usage-table.component.scss'],
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
    BgSpinnerComponent,
    DxoColumnChooserComponent
  ]
})
export class UsageTableComponent implements OnInit {
  private dataGridHelperService = inject(DataGridHelperService);
  private documentsService = inject(DocumentsService);
  private destroyRef = inject(DestroyRef);
  private searchSubj = new Subject<string>();

  readonly dataGrid = viewChild.required(DxDataGridComponent);

  readonly stats = this.documentsService.getDocumentsStats();

  readonly indicatorSrc = tableIndicatorSrc;

  ngOnInit(): void {
    this.handleSearch();
  }

  onShowColumnChooser(): void {
    this.dataGridHelperService.showColumnChooser(this.dataGrid());
  }

  onExport(): void {
    this.dataGridHelperService.exportToExcel(this.dataGrid().instance, 'usage_data');
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
