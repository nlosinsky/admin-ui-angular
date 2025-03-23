import { Pipe, PipeTransform } from '@angular/core';
import { TransformHelper } from '@app/shared/utils/transform-helper';

@Pipe({
  name: 'stringValueCapitalize',
  standalone: true
})
export class StringValueCapitalizePipe implements PipeTransform {
  transform(value: string): string {
    return TransformHelper.stringValueCapitalize(value);
  }
}
