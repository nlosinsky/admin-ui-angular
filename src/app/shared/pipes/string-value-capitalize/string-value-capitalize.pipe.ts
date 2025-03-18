import { Pipe, PipeTransform, NgModule } from '@angular/core';
import { TransformHelper } from '@app/shared/utils/transform-helper';

@Pipe({
  name: 'stringValueCapitalize'
})
export class StringValueCapitalizePipe implements PipeTransform {
  transform(value: string): string {
    return TransformHelper.stringValueCapitalize(value);
  }
}

@NgModule({
  imports: [],
  exports: [StringValueCapitalizePipe],
  declarations: [StringValueCapitalizePipe],
  providers: []
})
export class StringValueCapitalizeModule {}
