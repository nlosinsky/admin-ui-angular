import { NgClass, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CompanyMember, HttpError } from '@app/shared/models';
import { CompanyMemberAccountState, CompanyMemberAccountStateType } from '@app/shared/models/companies/company.enum';
import { CommonCustomerComponentActions } from '@app/shared/models/components';
import { BgSpinnerComponent } from '@components/bg-spinner/bg-spinner.component';
import { StatusItemComponent } from '@components/status-item/status-item.component';
import { StatusColorPipe } from '@pipes/status-color/status-color.pipe';
import { StringValueCapitalizePipe } from '@pipes/string-value-capitalize/string-value-capitalize.pipe';
import { CompaniesService } from '@services/data/companies.service';
import { ToastService } from '@services/helpers/toast.service';
import { CompanyUserService } from '@views/companies/company/users/user/company-user.service';
import { DxButtonModule, DxSelectBoxModule, DxTextBoxModule } from 'devextreme-angular';
import { EMPTY, Subject } from 'rxjs';
import { catchError, finalize, takeUntil } from 'rxjs/operators';

interface CompanyUserForm {
  accountState: FormControl<CompanyMemberAccountStateType>;
}

@Component({
  selector: 'app-company-user',
  templateUrl: './company-user.component.html',
  styleUrls: ['./company-user.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NgIf,
    NgClass,
    ReactiveFormsModule,
    StatusItemComponent,
    StatusColorPipe,
    StringValueCapitalizePipe,
    DxTextBoxModule,
    DxButtonModule,
    DxSelectBoxModule,
    BgSpinnerComponent
  ]
})
export class CompanyUserComponent implements OnInit, OnDestroy, CommonCustomerComponentActions {
  form!: FormGroup<CompanyUserForm>;
  isDataLoaded = false;
  member!: CompanyMember;
  isSubmitting = false;
  isEditMode = false;

  private memberId!: string;

  readonly accountStateList = [
    CompanyMemberAccountState.APPROVED,
    CompanyMemberAccountState.HOLD,
    CompanyMemberAccountState.UPDATE_REQUIRED
  ];

  private ngUnsub = new Subject<void>();

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private companiesService: CompaniesService,
    private cd: ChangeDetectorRef,
    private companyUserService: CompanyUserService,
    private fb: NonNullableFormBuilder,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.listenRouteChanges();
    this.loadData();
  }

  ngOnDestroy(): void {
    this.ngUnsub.next();
    this.ngUnsub.complete();
  }

  navigateBack = () => this.router.navigate(['../'], { relativeTo: this.route });

  onEdit() {
    this.router.navigate([], { relativeTo: this.route, queryParams: { edit: true } });
  }

  onCancel() {
    if (this.isSubmitting) {
      return;
    }

    this.router.navigate([], { relativeTo: this.route, queryParams: null });
  }

  onSave() {
    const newAccountState = (this.form.value as { accountState: CompanyMemberAccountStateType }).accountState || null;

    if (this.member.accountState === newAccountState) {
      this.onCancel();
      return;
    }

    this.isSubmitting = true;

    this.companiesService
      .updateCompanyMemberAccountState(this.memberId, newAccountState)
      .pipe(
        catchError((error: HttpError) => {
          this.toastService.showHttpError(error);
          return EMPTY;
        }),
        finalize(() => {
          this.isSubmitting = false;
          this.cd.markForCheck();
        }),
        takeUntil(this.ngUnsub)
      )
      .subscribe(({ accountState }) => {
        this.toastService.showSuccess('Member data has been updated successfully.');
        this.member.accountState = accountState;
        this.form.get('accountState')?.setValue(accountState);
        this.isSubmitting = false;
        this.onCancel();
      });
  }

  get isDisabled(): boolean {
    return this.isSubmitting || !this.isEditMode;
  }

  private listenRouteChanges() {
    this.route.queryParamMap.pipe(takeUntil(this.ngUnsub)).subscribe(paramsMap => {
      this.isEditMode = paramsMap.has('edit');

      if (this.form && this.form.dirty) {
        this.restoreForm();
      }
      this.cd.markForCheck();
    });
  }

  private loadData() {
    this.memberId = this.route.snapshot.paramMap.get('id') || '';

    this.companyUserService
      .getData(this.memberId)
      .pipe(
        finalize(() => {
          this.isDataLoaded = true;
          this.cd.markForCheck();
        }),
        takeUntil(this.ngUnsub)
      )
      .subscribe(member => {
        if (!member) {
          return;
        }

        this.member = member;
        this.initFormData(member);
      });
  }

  private initFormData(data: CompanyMember): void {
    this.form = this.fb.group({ accountState: data.accountState });
  }

  private restoreForm(): void {
    const { accountState } = this.member;
    this.form.reset({ accountState });
  }
}
