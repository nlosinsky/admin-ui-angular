import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { tableIndicatorSrc } from '@app/shared/constants';
import { DocumentsStat, HttpError } from '@app/shared/models';
import { BgSpinnerComponent } from '@components/bg-spinner/bg-spinner.component';
import { GeneralToolbarComponent } from '@components/general-toolbar/general-toolbar.component';
import { DocumentsService } from '@services/data/documents.service';
import { DataGridHelperService } from '@services/helpers/data-grid-helper.service';
import { ToastService } from '@services/helpers/toast.service';
import { DxButtonModule, DxDataGridComponent, DxDataGridModule, DxTextBoxModule } from 'devextreme-angular';
import { QuicklinkModule } from 'ngx-quicklink';
import { EMPTY, Subject } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, finalize, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-usage-table',
  templateUrl: './usage-table.component.html',
  styleUrls: ['./usage-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    CommonModule,
    GeneralToolbarComponent,
    DxDataGridModule,
    DxButtonModule,
    DxTextBoxModule,
    QuicklinkModule,
    BgSpinnerComponent
  ]
})
export class UsageTableComponent implements OnInit, OnDestroy {
  @ViewChild(DxDataGridComponent) dataGrid!: DxDataGridComponent;

  stats!: DocumentsStat[];

  isDataLoaded = false;

  readonly indicatorSrc = tableIndicatorSrc;

  private searchSubj = new Subject<string>();

  private ngUnsub = new Subject<void>();

  constructor(
    private cd: ChangeDetectorRef,
    private dataGridHelperService: DataGridHelperService,
    private toastService: ToastService,
    private documentsService: DocumentsService
  ) {}

  ngOnInit(): void {
    this.handleSearch();
    this.loadData();
  }

  ngOnDestroy(): void {
    this.ngUnsub.next();
    this.ngUnsub.complete();
  }

  openColumnChooserButtonClick(): void {
    this.dataGridHelperService.openTableChooser(this.dataGrid);
  }

  onExport(): void {
    this.dataGridHelperService.exportToExcel(this.dataGrid.instance, 'usage_data');
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

  private loadData() {
    this.documentsService
      .getDocumentsStats()
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
      .subscribe(stats => {
        this.stats = stats;
      });
  }
}
