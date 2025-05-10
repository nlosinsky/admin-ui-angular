import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  inject,
  viewChild
} from '@angular/core';
import { tableIndicatorSrc } from '@app/shared/constants';
import { DocumentsStat, HttpError } from '@app/shared/models';
import { BgSpinnerComponent } from '@components/bg-spinner/bg-spinner.component';
import { GeneralToolbarComponent } from '@components/general-toolbar/general-toolbar.component';
import { DocumentsService } from '@services/data/documents.service';
import { DataGridHelperService } from '@services/helpers/data-grid-helper.service';
import { ToastService } from '@services/helpers/toast.service';
import { DxButtonModule, DxDataGridComponent, DxDataGridModule, DxTextBoxModule } from 'devextreme-angular';
import { EMPTY, Subject } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, finalize, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-usage-table',
  templateUrl: './usage-table.component.html',
  styleUrls: ['./usage-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [GeneralToolbarComponent, DxDataGridModule, DxButtonModule, DxTextBoxModule, BgSpinnerComponent]
})
export class UsageTableComponent implements OnInit, OnDestroy {
  private cd = inject(ChangeDetectorRef);
  private dataGridHelperService = inject(DataGridHelperService);
  private toastService = inject(ToastService);
  private documentsService = inject(DocumentsService);

  readonly dataGrid = viewChild.required(DxDataGridComponent);

  stats: DocumentsStat[] = [];

  isDataLoaded = false;

  readonly indicatorSrc = tableIndicatorSrc;

  private searchSubj = new Subject<string>();

  private ngUnsub = new Subject<void>();

  ngOnInit(): void {
    this.handleSearch();
    this.loadData();
  }

  ngOnDestroy(): void {
    this.ngUnsub.next();
    this.ngUnsub.complete();
  }

  openColumnChooserButtonClick(): void {
    this.dataGridHelperService.openTableChooser(this.dataGrid());
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
      .pipe(distinctUntilChanged(), debounceTime(300), takeUntil(this.ngUnsub))
      .subscribe(val => {
        this.dataGrid().instance.searchByText(val);
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
