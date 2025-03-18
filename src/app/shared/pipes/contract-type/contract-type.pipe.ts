import { Pipe, PipeTransform, NgModule } from '@angular/core';

import { CompanyContractType } from '@app/shared/models/companies/company.enum';
import { TransformHelper } from '@app/shared/utils/transform-helper';

@Pipe({
  name: 'contractType'
})
export class ContractTypePipe implements PipeTransform {
  transform(type: CompanyContractType): string {
    return TransformHelper.contractType(type);
  }
}

@NgModule({
  imports: [],
  exports: [ContractTypePipe],
  declarations: [ContractTypePipe],
  providers: []
})
export class ContractTypePipeModule {}
