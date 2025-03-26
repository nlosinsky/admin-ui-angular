import { QueryList } from '@angular/core';
import { AbstractControl, UntypedFormGroup } from '@angular/forms';
import { DxValidatorComponent } from 'devextreme-angular';

export class FormHelper {
  static isValidField(field: AbstractControl | null): boolean {
    if (!field) {
      return true;
    }
    return !(field.invalid && (field.dirty || field.touched));
  }

  static setAllControlsDirty(controls: Record<string, AbstractControl | UntypedFormGroup>): void {
    Object.keys(controls)
      .map(key => controls[key])
      .forEach((value: AbstractControl) => {
        if (value instanceof UntypedFormGroup) {
          this.setAllControlsDirty(value.controls);
        } else {
          value.markAsDirty({ onlySelf: true });
        }
      });
  }

  static markTouchedAndDirty(formGroup: UntypedFormGroup): void {
    Object.values(formGroup.controls).forEach(control => {
      this.markControlTouchedAndDirty(control);

      if (control instanceof UntypedFormGroup && control.controls) {
        this.markTouchedAndDirty(control);
      }
    });
  }

  static triggerFormValidation(form: UntypedFormGroup, validators: QueryList<DxValidatorComponent>): void {
    FormHelper.markTouchedAndDirty(form);
    validators.forEach(item => item.instance.validate());
  }

  static markControlTouchedAndDirty(formControl: AbstractControl): void {
    formControl.markAsTouched();
    formControl.markAsDirty();
  }
}
