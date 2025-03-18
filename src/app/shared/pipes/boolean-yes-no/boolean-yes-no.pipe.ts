import { NgModule, Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'booleanYesNo'
})
export class BooleanYesNoPipe implements PipeTransform {
  transform(value: boolean): string {
    return value ? 'Yes' : 'No';
  }
}

@NgModule({
  imports: [],
  exports: [BooleanYesNoPipe],
  declarations: [BooleanYesNoPipe],
  providers: []
})
export class BooleanYesNoPipeModule {}
