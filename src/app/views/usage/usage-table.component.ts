import { ChangeDetectionStrategy, Component, DestroyRef, OnInit, inject, viewChild, signal } from '@angular/core';
import { tableIndicatorSrc } from '@app/shared/constants';
import { DocumentsStat, HttpError } from '@app/shared/models';
import { BgSpinnerComponent } from '@components/bg-spinner/bg-spinner.component';
import { GeneralToolbarComponent } from '@components/general-toolbar/general-toolbar.component';
import { DocumentsService } from '@services/data/documents.service';
import { DataGridHelperService } from '@services/helpers/data-grid-helper.service';
import { ToastService } from '@services/helpers/toast.service';
import { DxButtonComponent, DxDataGridComponent, DxTextBoxComponent } from 'devextreme-angular';
import {
  DxiColumnComponent,
  DxoColumnChooserComponent,
  DxoLoadPanelComponent,
  DxoPagingComponent,
  DxoScrollingComponent
} from 'devextreme-angular/ui/nested';
import { EMPTY, Subject } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, finalize } from 'rxjs/operators';
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
  private toastService = inject(ToastService);
  private documentsService = inject(DocumentsService);
  private destroyRef = inject(DestroyRef);

  readonly dataGrid = viewChild.required(DxDataGridComponent);

  stats = signal<DocumentsStat[]>([]);
  isDataLoaded = signal(false);

  readonly indicatorSrc = tableIndicatorSrc;

  private searchSubj = new Subject<string>();

  ngOnInit(): void {
    this.handleSearch();
    this.loadData();
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

  private loadData() {
    this.isDataLoaded.set(false);
    this.documentsService
      .getDocumentsStats()
      .pipe(
        catchError((error: HttpError) => {
          this.toastService.showHttpError(error);
          return EMPTY;
        }),
        finalize(() => {
          this.isDataLoaded.set(true);
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(stats => {
        this.stats.set(stats);
      });
  }
}
