import { DatePipe, NgClass, NgIf } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  QueryList,
  TemplateRef,
  ViewChild,
  ViewChildren
} from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { Router } from '@angular/router';
import { City, Company, CompanyUpdateDTO, Country, HttpError, State } from '@app/shared/models';
import { CompanyState, CompanyStateType } from '@app/shared/models/companies/company.enum';
import { CommonCustomerComponentActions, Submittable } from '@app/shared/models/components';
import { FormHelper } from '@app/shared/utils/form-helper';
import { ObjectUtil } from '@app/shared/utils/object-util';
import { BgSpinnerComponent } from '@components/bg-spinner/bg-spinner.component';
import { StatusItemComponent } from '@components/status-item/status-item.component';
import { ErrorMessagePipe } from '@pipes/error-message/error-message.pipe';
import { StatusColorPipe } from '@pipes/status-color/status-color.pipe';
import { StringValueCapitalizePipe } from '@pipes/string-value-capitalize/string-value-capitalize.pipe';
import { ConstantDataHelperService } from '@services/helpers/constant-data-helper.service';
import { ToastService } from '@services/helpers/toast.service';
import { WebsiteUrlValidator } from '@validators/website-url.validator';
import { CompanyStateService } from '@views/companies/company/company-state.service';
import {
  DxButtonModule,
  DxDropDownButtonModule,
  DxSelectBoxModule,
  DxTextBoxModule,
  DxValidatorComponent,
  DxValidatorModule
} from 'devextreme-angular';
import { EMPTY, Subject } from 'rxjs';
import { catchError, filter, finalize, takeUntil } from 'rxjs/operators';
import { DxSelectBoxTypes } from 'devextreme-angular/ui/select-box';

interface CompanyInformationForm {
  name: FormControl<string>;
  website: FormControl<string>;
  streetAddress: FormControl<string>;
  country: FormControl<string>;
  state: FormControl<string>;
  city: FormControl<string>;
  zipCode: FormControl<string>;
  companyState: FormControl<CompanyStateType>;
}

@Component({
  selector: 'app-company-information',
  templateUrl: './company-information.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NgIf,
    NgClass,
    DatePipe,
    BgSpinnerComponent,
    ReactiveFormsModule,
    DxTextBoxModule,
    ErrorMessagePipe,
    DxButtonModule,
    DxDropDownButtonModule,
    DxValidatorModule,
    DxSelectBoxModule,
    StringValueCapitalizePipe,
    StatusItemComponent,
    StatusColorPipe
  ]
})
export class CompanyInformationComponent
  implements OnInit, OnDestroy, Submittable, CommonCustomerComponentActions, AfterViewInit
{
  @ViewChild('actionsTpl', { read: TemplateRef }) actionsTpl!: TemplateRef<HTMLElement>;
  @ViewChildren(DxValidatorComponent) validators!: QueryList<DxValidatorComponent>;

  isEditMode = false;
  isDataLoaded = false;
  company!: Company;
  form!: FormGroup<CompanyInformationForm>;
  isSubmitting = false;
  countries: Country[] = [];
  states: State[] = [];
  cities: City[] = [];
  zipCodes: string[] = [];
  actionsTemplateEvent = new EventEmitter<TemplateRef<HTMLElement>>();

  readonly companyStates = [CompanyState.ACTIVE, CompanyState.ARCHIVED];

  private ngUnsub = new Subject<void>();

  constructor(
    private companyStateService: CompanyStateService,
    private cd: ChangeDetectorRef,
    private fb: NonNullableFormBuilder,
    private toastService: ToastService,
    private router: Router,
    private constantDataHelperService: ConstantDataHelperService
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  ngAfterViewInit() {
    this.actionsTemplateEvent.emit(this.actionsTpl);
  }

  ngOnDestroy(): void {
    this.ngUnsub.next();
    this.ngUnsub.complete();
  }

  navigateBack = () => this.router.navigate(['/companies']);

  onValidateRule(fieldName: string) {
    return () => this.isValidField(fieldName);
  }

  isValidField(fieldName: string): boolean {
    if (!this.isEditMode) {
      return true;
    }
    const field = this.form.get(fieldName);
    return FormHelper.isValidField(field);
  }

  onCancelEdit() {
    this.restoreForm();
    this.isEditMode = false;
  }

  onEdit = () => {
    this.isEditMode = true;
    this.cd.markForCheck();
  };

  onSaveChanges() {
    if (!this.hasChangedData() && this.form.valid) {
      this.isEditMode = false;
      return;
    }

    if (this.form.invalid) {
      FormHelper.triggerFormValidation(this.form, this.validators);
      return;
    }

    this.isSubmitting = true;

    this.companyStateService
      .updateCompany(this.company.id, this.getPreparedData())
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
      .subscribe(() => {
        this.toastService.showSuccess('Company data has been updated successfully.');
        this.form.markAsPristine();
        this.isEditMode = false;
      });
  }

  private getPreparedData(): CompanyUpdateDTO {
    return this.getCompanyDTO(this.form.value as CompanyUpdateDTO);
  }

  hasChangedData(): boolean {
    return !ObjectUtil.isDeepEquals(this.getPreparedData(), this.getCompanyDTO(this.company));
  }

  loadData(): void {
    this.companyStateService.currentCompany$
      .pipe(
        catchError(() => EMPTY),
        filter(resp => !!(resp && resp.id)),
        takeUntil(this.ngUnsub)
      )
      .subscribe(data => {
        this.isDataLoaded = true;

        if (!data) {
          return;
        }

        this.company = data;
        this.populateLists(this.getCompanyDTO(this.company));
        this.setFormData(data);
        this.cd.markForCheck();
      });
  }

  restoreForm(): void {
    this.form.reset(this.getCompanyDTO(this.company));
  }

  setFormData(data: Company): void {
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

  private getCompanyDTO(company: Company | CompanyUpdateDTO): CompanyUpdateDTO {
    const { name, website, streetAddress, country, state, city, zipCode, companyState } = company;
    return { name, website, streetAddress, country, state, city, zipCode, companyState };
  }

  onCountryChange({ value: countryName }: DxSelectBoxTypes.ValueChangedEvent) {
    const country = this.countries.find(item => item.name === countryName);

    if (!country) {
      this.state.setValue('');
      this.state.disable();
    } else if (country.states) {
      this.state.enable();
      this.state.setValue('');
      this.states = country.states;
      this.cd.markForCheck();
    }
  }

  onStateChange({ value: stateName }: DxSelectBoxTypes.ValueChangedEvent) {
    const state = this.states.find(item => item.name === stateName);

    if (!state) {
      this.city.setValue('');
      this.city.disable();
      return;
    } else {
      this.city.enable();
    }

    if (state?.cities) {
      this.city.setValue('');
      this.cities = state.cities;
      this.cd.markForCheck();
    } else {
      this.cities = [];
    }
  }

  onCityChange({ value: cityName }: DxSelectBoxTypes.ValueChangedEvent) {
    const city = this.cities.find(item => item.name === cityName);

    if (!cityName) {
      this.zipCode.setValue('');
      this.zipCode.disable();
      return;
    } else {
      this.zipCode.enable();
    }

    if (city?.zipCodes) {
      this.zipCode.setValue('');
      this.zipCodes = city.zipCodes;
      this.cd.markForCheck();
    } else {
      this.zipCodes = [];
    }
  }

  onAddCustomCity(data: DxSelectBoxTypes.CustomItemCreatingEvent) {
    if (!data.text) {
      data.customItem = null;
      return;
    }

    const newItem = { name: data.text } as City;
    this.cities = [newItem].concat(this.cities);
    data.customItem = newItem;
    this.city.setValue(data.text);
  }

  onAddCustomZipCode(data: DxSelectBoxTypes.CustomItemCreatingEvent) {
    if (!data.text) {
      data.customItem = null;
      return;
    }

    const newItem = data.text;
    this.zipCodes = [newItem].concat(this.zipCodes);
    data.customItem = newItem;
    this.zipCode.setValue(data.text);
  }

  get state() {
    return this.form.get('state') as AbstractControl;
  }

  get city() {
    return this.form.get('city') as AbstractControl;
  }

  get zipCode() {
    return this.form.get('zipCode') as AbstractControl;
  }

  private populateLists(data: Company | CompanyUpdateDTO): void {
    this.countries = this.constantDataHelperService.getCountries();
    this.states = [];
    this.cities = [];
    this.zipCodes = [];

    if (data.country) {
      this.states = this.countries.find(c => c.name === data.country)?.states || [];
    }

    if (data.state) {
      this.cities = this.states.find(s => s.name === data.state)?.cities || [];
    }

    if (data.city) {
      this.zipCodes = this.cities.find(s => s.name === data.city)?.zipCodes || [];
    }
  }
}
