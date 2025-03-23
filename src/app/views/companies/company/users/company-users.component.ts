import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { tableIndicatorSrc } from '@app/shared/constants';
import { Company, CompanyMember, HttpError } from '@app/shared/models';
import { CompanyMemberAccountState } from '@app/shared/models/companies/company.enum';
import { CommonCustomerComponentActions } from '@app/shared/models/components';
import { AvatarBoxComponent } from '@components/avatar-box/avatar-box.component';
import { BgSpinnerComponent } from '@components/bg-spinner/bg-spinner.component';
import { StatusItemComponent } from '@components/status-item/status-item.component';
import { StatusColorPipe } from '@pipes/status-color/status-color.pipe';
import { StringValueCapitalizePipe } from '@pipes/string-value-capitalize/string-value-capitalize.pipe';
import { CompaniesService } from '@services/data/companies.service';
import { DialogService } from '@services/helpers/dialog.service';
import { ToastService } from '@services/helpers/toast.service';
import { CompanyStateService } from '@views/companies/company/company-state.service';
import {
  DxButtonModule,
  DxDataGridModule,
  DxDropDownButtonModule,
} from 'devextreme-angular';
import { QuicklinkModule } from 'ngx-quicklink';
import { EMPTY, from, Subject, zip } from 'rxjs';
import { catchError, filter, finalize, mergeMap, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-company-users',
  templateUrl: './company-users.component.html',
  styleUrls: ['./company-users.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    CommonModule,
    AvatarBoxComponent,
    DxDataGridModule,
    DxButtonModule,
    StatusItemComponent,
    StringValueCapitalizePipe,
    BgSpinnerComponent,
    DxDropDownButtonModule,
    StatusColorPipe,
    QuicklinkModule
  ]
})
export class CompanyUsersComponent implements OnInit, OnDestroy, CommonCustomerComponentActions {
  company!: Company;
  isDataLoaded = false;
  pendingMembers: CompanyMember[] = [];
  members: CompanyMember[] = [];
  approveRequestsSet = new Set<string>();
  declineRequestsSet = new Set<string>();

  readonly memberAccountState = CompanyMemberAccountState;
  readonly indicatorSrc = tableIndicatorSrc;

  private ngUnsub = new Subject<void>();

  constructor(
    private companyStateService: CompanyStateService,
    private companiesService: CompaniesService,
    private route: ActivatedRoute,
    private cd: ChangeDetectorRef,
    private toastService: ToastService,
    private dialogService: DialogService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  ngOnDestroy(): void {
    this.ngUnsub.next();
    this.ngUnsub.complete();
  }

  navigateBack = () => this.router.navigate(['/companies']);

  onViewMember(member: CompanyMember) {
    this.router.navigate([member.id], { relativeTo: this.route });
  }

  onEditMember = (member: CompanyMember) => {
    this.router.navigate([member.id], {
      relativeTo: this.route,
      queryParams: { edit: true }
    });
  };

  onDecline(memberId: string): void {
    if (this.declineRequestsSet.has(memberId)) {
      return;
    }

    from(this.dialogService.showConfirm('Do you want to Decline pending member?'))
      .pipe(
        filter(confirm => confirm),
        mergeMap(() => {
          this.declineRequestsSet.add(memberId);
          this.cd.markForCheck();
          return this.companiesService.disapprovePendingMember(memberId);
        }),
        catchError((error: HttpError) => {
          this.toastService.showHttpError(error);
          return EMPTY;
        }),
        finalize(() => {
          this.declineRequestsSet.delete(memberId);
          this.cd.markForCheck();
        }),
        takeUntil(this.ngUnsub)
      )
      .subscribe(() => {
        this.pendingMembers = this.pendingMembers.filter(item => item.id !== memberId);
        this.toastService.showSuccess('User has been successfully Declined.');
      });
  }

  onApprove(memberId: string): void {
    if (this.approveRequestsSet.has(memberId)) {
      return;
    }

    this.approveRequestsSet.add(memberId);
    this.companiesService
      .approvePendingMember(memberId)
      .pipe(
        mergeMap(() => this.companiesService.getMembers(this.company.id)),
        catchError((error: HttpErrorResponse) => {
          this.toastService.showHttpError(error);
          return EMPTY;
        }),
        finalize(() => {
          this.approveRequestsSet.delete(memberId);
          this.cd.markForCheck();
        }),
        takeUntil(this.ngUnsub)
      )
      .subscribe(members => {
        this.members = members;
        this.pendingMembers = this.pendingMembers.filter(item => item.id !== memberId);
        this.toastService.showSuccess('User has been successfully Approved.');
      });
  }

  trackByPending(index: number, member: CompanyMember): string {
    return member.id;
  }

  private loadData() {
    const companyId = this.route.snapshot.paramMap.get('companyId');
    if (!companyId) {
      return;
    }

    zip(
      this.companiesService.getPendingMembers(companyId),
      this.companiesService.getMembers(companyId),
      this.companyStateService.currentCompany$
    )
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
      .subscribe(([pendingMembers, members, company]) => {
        this.pendingMembers = pendingMembers;
        this.members = members;

        if (!company) {
          return;
        }
        this.company = company;
      });
  }
}
