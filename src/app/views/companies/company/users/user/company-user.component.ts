import { NgOptimizedImage } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  OnInit,
  inject,
  signal,
  computed,
  effect
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
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
import { DxButtonComponent, DxSelectBoxComponent, DxTemplateDirective, DxTextBoxComponent } from 'devextreme-angular';
import { EMPTY } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';

type CompanyUserForm = {
  accountState: FormControl<CompanyMemberAccountStateType>;
};

@Component({
  selector: 'app-company-user',
  templateUrl: './company-user.component.html',
  styleUrls: ['./company-user.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    DxSelectBoxComponent,
    StatusItemComponent,
    StatusColorPipe,
    StringValueCapitalizePipe,
    DxTextBoxComponent,
    DxTemplateDirective,
    DxButtonComponent,
    BgSpinnerComponent,
    NgOptimizedImage
  ]
})
export class CompanyUserComponent implements OnInit, CommonCustomerComponentActions {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private companiesService = inject(CompaniesService);
  private companyUserService = inject(CompanyUserService);
  private fb = inject(NonNullableFormBuilder);
  private toastService = inject(ToastService);
  private destroyRef = inject(DestroyRef);

  form!: FormGroup<CompanyUserForm>;
  isSubmitting = signal(false);
  isEditMode = signal(false);
  isDisabled = computed(() => this.isSubmitting() || !this.isEditMode());
  member = this.companyUserService.getMemberById(this.route.snapshot.paramMap.get('id'));

  readonly accountStateList = [
    CompanyMemberAccountState.APPROVED,
    CompanyMemberAccountState.HOLD,
    CompanyMemberAccountState.UPDATE_REQUIRED
  ];

  constructor() {
    effect(() => {
      if (this.member.hasValue()) {
        this.initFormData(this.member.value());
      }
    });
  }

  ngOnInit(): void {
    this.listenRouteChanges();
  }

  navigateBack = () => this.router.navigate(['../'], { relativeTo: this.route });

  onEdit() {
    this.router.navigate([], { relativeTo: this.route, queryParams: { edit: true } });
  }

  onCancel() {
    if (this.isSubmitting()) {
      return;
    }

    this.router.navigate([], { relativeTo: this.route, queryParams: null });
  }

  onSave() {
    const newAccountState = (this.form.value as { accountState: CompanyMemberAccountStateType }).accountState || null;

    const memberId = this.member.value()?.id;

    if (!memberId) {
      return;
    }

    if (this.member.value()?.accountState === newAccountState) {
      this.onCancel();
      return;
    }

    this.isSubmitting.set(true);

    this.companiesService
      .updateCompanyMemberAccountState(memberId, newAccountState)
      .pipe(
        catchError((error: HttpError) => {
          this.toastService.showHttpError(error);
          return EMPTY;
        }),
        finalize(() => this.isSubmitting.set(false)),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(({ accountState }) => {
        this.toastService.showSuccess('Member data has been updated successfully.');
        this.form.get('accountState')?.setValue(accountState);
        this.member.update(member => new CompanyMember({ ...member, accountState }));
        this.onCancel();
      });
  }

  private listenRouteChanges() {
    this.route.queryParamMap.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(paramsMap => {
      this.isEditMode.set(paramsMap.has('edit'));

      if (this.form?.dirty) {
        this.restoreForm();
      }
    });
  }

  private initFormData(data: CompanyMember): void {
    this.form = this.fb.group({ accountState: data.accountState });
  }

  private restoreForm(): void {
    const { accountState } = this.member.value() || {};
    this.form.reset({ accountState });
  }
}
