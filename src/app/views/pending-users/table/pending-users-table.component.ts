import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { tableIndicatorSrc } from '@app/shared/constants';
import { HttpError, PendingUser } from '@app/shared/models';
import { CompanyMemberAccountState } from '@app/shared/models/companies/company.enum';
import { CompaniesService } from '@services/data/companies.service';
import { UserService } from '@services/data/user.service';
import { DataGridHelperService } from '@services/helpers/data-grid-helper.service';
import { ToastService } from '@services/helpers/toast.service';
import { DxDataGridComponent } from 'devextreme-angular';
import { EMPTY, Subject } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, finalize, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-pending-users-table',
  templateUrl: './pending-users-table.component.html',
  styleUrls: ['./pending-users-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PendingUsersTableComponent implements OnInit, OnDestroy {
  @ViewChild(DxDataGridComponent) dataGrid!: DxDataGridComponent;

  isDataLoaded = false;
  pendingUsers: PendingUser[] = [];

  readonly indicatorSrc = tableIndicatorSrc;
  readonly memberAccountState = CompanyMemberAccountState;

  private searchSubj = new Subject<string>();
  private ngUnsub = new Subject<void>();

  constructor(
    private cd: ChangeDetectorRef,
    private dataGridHelperService: DataGridHelperService,
    private companiesService: CompaniesService,
    private toastService: ToastService,
    private userService: UserService
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

  calculateDisplayValue = (item: PendingUser) => {
    return item.accountState === this.memberAccountState.NOT_ACTIVE
      ? 'Pending Activation'
      : 'Activated, but no company';
  };

  onExport(): void {
    this.dataGridHelperService.exportToExcel(this.dataGrid.instance, 'pending_users');
  }

  onSearch(event: KeyboardEvent): void {
    this.searchSubj.next((event.target as HTMLInputElement).value);
  }

  onResendEmail = (user: PendingUser) => {
    this.userService
      .resendUserActivation(user.id)
      .pipe(
        catchError((error: HttpError) => {
          this.toastService.showHttpError(error);
          return EMPTY;
        }),
        takeUntil(this.ngUnsub)
      )
      .subscribe(() => {
        this.toastService.showSuccess('The email was successfully sent.');
      });
  };

  private handleSearch(): void {
    this.searchSubj
      .asObservable()
      .pipe(distinctUntilChanged(), debounceTime(300), takeUntil(this.ngUnsub))
      .subscribe(val => {
        this.dataGrid.instance.searchByText(val);
      });
  }

  private loadData() {
    this.userService
      .getPendingUsers()
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
      .subscribe(data => {
        this.pendingUsers = data;
      });
  }
}
