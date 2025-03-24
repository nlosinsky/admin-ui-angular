import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'booleanYesNo',
  standalone: true
})
export class BooleanYesNoPipe implements PipeTransform {
  transform(value: boolean): string {
    return value ? 'Yes' : 'No';
  }
}
