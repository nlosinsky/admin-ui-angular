import { DatePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  TemplateRef,
  inject,
  viewChild,
  viewChildren,
  effect,
  signal,
  computed,
  untracked
} from '@angular/core';
import { FormControl, FormGroup, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { City, Company, CompanyUpdateDTO, HttpError, State } from '@app/shared/models';
import { CompanyState, CompanyStateType } from '@app/shared/models/companies/company.enum';
import { CommonCustomerComponentActions, Submittable, TabWithActions } from '@app/shared/models/components';
import { FormHelper } from '@app/shared/utils/form-helper';
import { ObjectUtil } from '@app/shared/utils/object-util';
import { BgSpinnerComponent } from '@components/bg-spinner/bg-spinner.component';
import { StatusItemComponent } from '@components/status-item/status-item.component';
import { ErrorMessagePipe } from '@pipes/error-message/error-message.pipe';
import { StatusColorPipe } from '@pipes/status-color/status-color.pipe';
import { StringValueCapitalizePipe } from '@pipes/string-value-capitalize/string-value-capitalize.pipe';
import { ConstantDataApiService } from '@services/api/constant-data-api.service';
import { ToastService } from '@services/helpers/toast.service';
import { WebsiteUrlValidator } from '@validators/website-url.validator';
import { CompanyStateService } from '@views/companies/company/company-state.service';
import {
  DxButtonComponent,
  DxDropDownButtonComponent,
  DxSelectBoxComponent,
  DxTemplateDirective,
  DxTextBoxComponent,
  DxValidatorComponent
} from 'devextreme-angular';
import { DxiItemComponent, DxiValidationRuleComponent } from 'devextreme-angular/ui/nested';
import { EMPTY } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DxSelectBoxTypes } from 'devextreme-angular/ui/select-box';

type CompanyInformationForm = {
  name: FormControl<string>;
  website: FormControl<string>;
  streetAddress: FormControl<string>;
  country: FormControl<string>;
  state: FormControl<string>;
  city: FormControl<string>;
  zipCode: FormControl<string>;
  companyState: FormControl<CompanyStateType>;
};

@Component({
  selector: 'app-company-information',
  templateUrl: './company-information.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    DxButtonComponent,
    DxDropDownButtonComponent,
    DxiItemComponent,
    ReactiveFormsModule,
    DxTextBoxComponent,
    DxValidatorComponent,
    ErrorMessagePipe,
    DxiValidationRuleComponent,
    DxSelectBoxComponent,
    DxTemplateDirective,
    StatusItemComponent,
    StatusColorPipe,
    StringValueCapitalizePipe,
    DatePipe,
    BgSpinnerComponent
  ]
})
export class CompanyInformationComponent implements Submittable, TabWithActions, CommonCustomerComponentActions {
  private companyStateService = inject(CompanyStateService);
  private fb = inject(NonNullableFormBuilder);
  private toastService = inject(ToastService);
  private router = inject(Router);
  private constantDataApiService = inject(ConstantDataApiService);
  private destroyRef = inject(DestroyRef);

  readonly actionsTpl = viewChild.required('actionsTpl', { read: TemplateRef });
  readonly validators = viewChildren(DxValidatorComponent);

  readonly currentCompany = this.companyStateService.currentCompany;
  readonly currentCompanyId = this.companyStateService.currentCompanyId;

  isEditMode = signal(false);
  isDataLoaded = computed(() => !this.countriesResource.isLoading());
  isSubmitting = signal(false);
  states = signal<State[]>([]);
  cities = signal<City[]>([]);
  zipCodes = signal<string[]>([]);

  readonly countriesResource = this.constantDataApiService.countriesResource;

  readonly companyStates = [CompanyState.ACTIVE, CompanyState.ARCHIVED];

  form!: FormGroup<CompanyInformationForm>;

  constructor() {
    effect(() => {
      if (!this.form) {
        this.setFormData(this.currentCompany.value());
      }
    });

    effect(() => {
      const currentCompany = this.currentCompany.value();
      this.populateLists(untracked(() => this.getCompanyDTO(currentCompany)));
    });
  }

  navigateBack = () => this.router.navigate(['/companies']);

  onValidateRule(fieldName: string) {
    return () => this.isValidField(fieldName);
  }

  isValidField(fieldName: string): boolean {
    if (!this.isEditMode()) {
      return true;
    }
    const field = this.form.get(fieldName);
    return FormHelper.isValidField(field);
  }

  onCancelEdit() {
    this.restoreForm();
    this.isEditMode.set(false);
  }

  onEdit = () => {
    this.isEditMode.set(true);
  };

  onSaveChanges() {
    const companyId = this.currentCompanyId();

    if (!companyId) {
      return;
    }

    if (!this.hasChangedData() && this.form.valid) {
      this.isEditMode.set(false);
      return;
    }

    if (this.form.invalid) {
      FormHelper.triggerFormValidation(this.form, this.validators());
      return;
    }

    this.isSubmitting.set(true);

    this.companyStateService
      .updateCompany(companyId, this.getPreparedData())
      .pipe(
        catchError((error: HttpError) => {
          this.toastService.showHttpError(error);
          return EMPTY;
        }),
        finalize(() => this.isSubmitting.set(false)),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(() => {
        this.toastService.showSuccess('Company data has been updated successfully.');
        this.form.markAsPristine();
        this.isEditMode.set(false);
      });
  }

  private getPreparedData(): CompanyUpdateDTO {
    return this.getCompanyDTO(this.form.value as CompanyUpdateDTO);
  }

  hasChangedData(): boolean {
    return !ObjectUtil.isDeepEquals(this.getPreparedData(), this.getCompanyDTO(this.currentCompany.value()));
  }

  restoreForm(): void {
    this.form.reset(this.getCompanyDTO(this.currentCompany.value()));
  }

  setFormData(data: Company | null): void {
    if (!data) {
      return;
    }

    this.form = this.fb.group({
      name: [data.name, [Validators.required, Validators.maxLength(30)]],
      website: [data.website, [Validators.required, WebsiteUrlValidator(), Validators.maxLength(500)]],
      streetAddress: [data.streetAddress, [Validators.required, Validators.maxLength(50)]],
      country: [data.country, [Validators.required]],
      state: [data.state, [Validators.required]],
      city: [data.city, [Validators.required]],
      zipCode: [data.zipCode, [Validators.required]],
      companyState: data.companyState
    });
  }

  private getCompanyDTO(company: Company | CompanyUpdateDTO | null): CompanyUpdateDTO {
    if (!company) {
      return {
        name: '',
        website: '',
        streetAddress: '',
        country: '',
        state: '',
        city: '',
        zipCode: '',
        companyState: CompanyState.ACTIVE
      };
    }

    const { name, website, streetAddress, country, state, city, zipCode, companyState } = company;
    return { name, website, streetAddress, country, state, city, zipCode, companyState };
  }

  onCountryChange({ value: countryName }: DxSelectBoxTypes.ValueChangedEvent) {
    const country = this.countriesResource.value().find(item => item.name === countryName);

    if (!country) {
      this.state.setValue('');
      this.state.disable();
    } else if (country.states) {
      this.state.enable();
      this.state.setValue('');
      this.states.set(country.states);
    }
  }

  onStateChange({ value: stateName }: DxSelectBoxTypes.ValueChangedEvent) {
    const state = this.states().find(item => item.name === stateName);

    if (!state) {
      this.city.setValue('');
      this.city.disable();
      return;
    } else {
      this.city.enable();
    }

    if (state?.cities) {
      this.city.setValue('');
      this.cities.set(state.cities);
    } else {
      this.cities.set([]);
    }
  }

  onCityChange({ value: cityName }: DxSelectBoxTypes.ValueChangedEvent) {
    const city = this.cities().find(item => item.name === cityName);

    if (!cityName) {
      this.zipCode.setValue('');
      this.zipCode.disable();
      return;
    } else {
      this.zipCode.enable();
    }

    if (city?.zipCodes) {
      this.zipCode.setValue('');
      this.zipCodes.set(city.zipCodes);
    } else {
      this.zipCodes.set([]);
    }
  }

  onAddCustomCity(data: DxSelectBoxTypes.CustomItemCreatingEvent) {
    if (!data.text) {
      data.customItem = null;
      return;
    }

    const newItem = { name: data.text } as City;
    data.customItem = newItem;
    this.cities.update(cities => [...cities, newItem]);
  }

  onAddCustomZipCode(data: DxSelectBoxTypes.CustomItemCreatingEvent) {
    if (!data.text) {
      data.customItem = null;
      return;
    }

    const newItem = data.text;
    data.customItem = newItem;
    this.zipCodes.update(zipCodes => [...zipCodes, newItem]);
  }

  get state() {
    return this.form.get('state') as FormControl<string>;
  }

  get city() {
    return this.form.get('city') as FormControl<string>;
  }

  get zipCode() {
    return this.form.get('zipCode') as FormControl<string>;
  }

  private populateLists(data: Company | CompanyUpdateDTO): void {
    const country = this.countriesResource.value().find(item => item.name === data.country);

    if (country?.states) {
      this.states.set(country.states);
    }

    const state = this.states().find(item => item.name === data.state);

    if (state?.cities) {
      this.cities.set(state.cities);
    }

    const city = this.cities().find(item => item.name === data.city);

    if (city?.zipCodes) {
      this.zipCodes.set(city.zipCodes);
    }
  }
}
