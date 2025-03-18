import { NgModule, Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'errorMessage'
})
export class ErrorMessagePipe implements PipeTransform {
  transform(errors: null | undefined | { [key: string]: string & { [key: string]: unknown } }): string {
    if (!errors) {
      return '';
    }

    if (errors.required) {
      return 'Field is required';
    }

    if (errors.max) {
      const max = errors.max.max as string;
      return `The number must be less then or equal to ${max}`;
    }
    if (errors.min) {
      const min = errors.min.min as string;
      return `The number must be grater then or equal to ${min}`;
    }

    if (errors.email) {
      return 'Field is invalid';
    }

    if (errors.maxlength) {
      const msg = errors.maxlength.requiredLength as string;
      return `Max ${msg} characters`;
    }

    if (errors.minlength) {
      const msg = errors.minlength.requiredLength as string;
      return `Min ${msg} characters`;
    }

    if (errors.websiteUrl) {
      return 'The input mast be a valid website url';
    }

    return '';
  }
}

@NgModule({
  imports: [],
  exports: [ErrorMessagePipe],
  declarations: [ErrorMessagePipe],
  providers: []
})
export class ErrorMessagePipeModule {}
