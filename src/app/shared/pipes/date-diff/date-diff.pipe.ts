import { Pipe, PipeTransform, NgModule } from '@angular/core';

import { differenceInYears } from 'date-fns';

enum Diff {
  YEAR = 'year'
}
type DiffType = 'year';

@Pipe({
  name: 'dateDiff'
})
export class DateDiffPipe implements PipeTransform {
  transform(startDate: Date, endDate: Date, type: DiffType): string | null {
    if (type === Diff.YEAR) {
      const value = differenceInYears(endDate, startDate);
      const strType = value === 1 ? 'year' : 'years';

      return `${value} ${strType}`;
    }

    return null;
  }
}

@NgModule({
  imports: [],
  exports: [DateDiffPipe],
  declarations: [DateDiffPipe],
  providers: []
})
export class DateDiffPipeModule {}
