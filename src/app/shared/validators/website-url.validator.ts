import { AbstractControl } from '@angular/forms';
import { TypeCheck } from '@app/shared/utils/type-check';

function isValid(value: string): boolean {
  if (!value) {
    return true;
  }

  return TypeCheck.isWebsiteUrl(value);
}

export function WebsiteUrlValidator() {
  return (control: AbstractControl): { websiteUrl: boolean } | null => {
    return isValid(control.value as string) ? null : { websiteUrl: true };
  };
}
