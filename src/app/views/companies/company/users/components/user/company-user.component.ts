import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpError, ProductsOfInterest, User } from '@app/shared/models';
import { CompanyMemberAccountState, CompanyMemberAccountStateType } from '@app/shared/models/companies/company.enum';
import { CommonCustomerComponentActions } from '@app/shared/models/components';
import { CompaniesService } from '@services/data/companies.service';
import { ConstantDataHelperService } from '@services/helpers/constant-data-helper.service';
import { ToastService } from '@services/helpers/toast.service';
import { CompanyUserService } from '@views/companies/company/users/components/user/company-user.service';
import { EMPTY, Subject } from 'rxjs';
import { catchError, finalize, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-company-user',
  templateUrl: './company-user.component.html',
  styleUrls: ['./company-user.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CompanyUserComponent implements OnInit, OnDestroy, CommonCustomerComponentActions {
  form!: FormGroup;
  isDataLoaded = false;
  member!: User;
  isSubmitting = false;
  isEditMode = false;
  productsOfInterests: ProductsOfInterest[] = [];

  private companyId!: string;
  private memberId!: string;

  readonly memberAccountState = CompanyMemberAccountState;
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
    private fb: FormBuilder,
    private toastService: ToastService,
    private constantDataHelperService: ConstantDataHelperService
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
    const newAccountState = (<{ accountState: CompanyMemberAccountStateType }>this.form.value).accountState || null;

    if (this.member.accountState === newAccountState) {
      this.onCancel();
      return;
    }

    this.isSubmitting = true;

    this.companiesService
      .updateCompanyMemberAccountState(this.companyId, this.memberId, newAccountState)
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
    this.companyId = this.route.snapshot.paramMap.get('companyId') || '';
    this.memberId = this.route.snapshot.paramMap.get('id') || '';
    this.companyUserService
      .getData(this.companyId, this.memberId)
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
        this.initProductsOfInterests();
      });
  }

  private initFormData(data: User): void {
    this.form = this.fb.group({ accountState: data.accountState });
  }

  private restoreForm(): void {
    const { accountState } = this.member;
    this.form.reset({ accountState });
  }

  private initProductsOfInterests() {
    this.productsOfInterests = this.constantDataHelperService.getProductOfInterest().map(item => {
      return { ...item, isSelected: this.member.productsOfInterestIds.includes(item.id) };
    });
  }
}
