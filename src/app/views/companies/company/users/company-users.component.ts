import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal, computed } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { tableIndicatorSrc } from '@app/shared/constants';
import { CompanyMember, HttpError } from '@app/shared/models';
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
  DxButtonComponent,
  DxDataGridComponent,
  DxDropDownButtonComponent,
  DxTemplateDirective
} from 'devextreme-angular';
import {
  DxiColumnComponent,
  DxiItemComponent,
  DxoLoadPanelComponent,
  DxoPagingComponent,
  DxoScrollingComponent
} from 'devextreme-angular/ui/nested';
import { EMPTY, from } from 'rxjs';
import { catchError, filter, finalize, mergeMap } from 'rxjs/operators';

@Component({
  selector: 'app-company-users',
  templateUrl: './company-users.component.html',
  styleUrls: ['./company-users.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    DxButtonComponent,
    DxDataGridComponent,
    DxoPagingComponent,
    DxoLoadPanelComponent,
    DxoScrollingComponent,
    DxiColumnComponent,
    DxTemplateDirective,
    AvatarBoxComponent,
    StatusColorPipe,
    StringValueCapitalizePipe,
    StatusItemComponent,
    DxDropDownButtonComponent,
    DxiItemComponent,
    BgSpinnerComponent
  ]
})
export class CompanyUsersComponent implements CommonCustomerComponentActions {
  private companyStateService = inject(CompanyStateService);
  private companiesService = inject(CompaniesService);
  private route = inject(ActivatedRoute);
  private destroyRef = inject(DestroyRef);
  private toastService = inject(ToastService);
  private dialogService = inject(DialogService);
  private router = inject(Router);

  companyId = this.companyStateService.currentCompanyId;
  approveRequestsSet = signal<Set<string>>(new Set<string>());
  declineRequestsSet = signal<Set<string>>(new Set<string>());

  pendingMembers = this.companiesService.getPendingMembers(this.companyId);
  members = this.companiesService.getMembers(this.companyId);
  isDataLoaded = computed(() => !(this.pendingMembers.isLoading() || this.members.isLoading()));

  readonly indicatorSrc = tableIndicatorSrc;

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

  // todo add decorator
  onDecline(memberId: string): void {
    if (this.declineRequestsSet().has(memberId)) {
      return;
    }

    from(this.dialogService.showConfirm('Do you want to Decline pending member?'))
      .pipe(
        filter(confirm => confirm),
        mergeMap(() => {
          this.declineRequestsSet.update(set => {
            const newSet = new Set(set);
            newSet.add(memberId);
            return newSet;
          });
          return this.companiesService.disapprovePendingMember(memberId);
        }),
        catchError((error: HttpError) => {
          this.toastService.showHttpError(error);
          return EMPTY;
        }),
        finalize(() => {
          this.declineRequestsSet.update(set => {
            const newSet = new Set(set);
            newSet.delete(memberId);
            return newSet;
          });
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(() => {
        this.pendingMembers.reload();
        this.toastService.showSuccess('User has been successfully Declined.');
      });
  }

  // todo add decorator
  onApprove(memberId: string): void {
    const companyId = this.companyId();

    if (!companyId) {
      return;
    }

    if (this.approveRequestsSet().has(memberId)) {
      return;
    }

    this.approveRequestsSet.update(set => {
      const newSet = new Set(set);
      newSet.add(memberId);
      return newSet;
    });
    this.companiesService
      .approvePendingMember(memberId)
      .pipe(
        finalize(() => {
          this.approveRequestsSet.update(set => {
            const newSet = new Set(set);
            newSet.delete(memberId);
            return newSet;
          });
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(() => {
        this.members.reload();
        this.pendingMembers.reload();
        this.toastService.showSuccess('User has been successfully Approved.');
      });
  }
}
