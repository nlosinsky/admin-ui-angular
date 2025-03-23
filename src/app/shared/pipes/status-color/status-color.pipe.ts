import { Pipe, PipeTransform } from '@angular/core';
import { StatusColorsEnum } from '@app/shared/models/common';
import { CompanyMemberAccountStateType, CompanyStateType } from '@app/shared/models/companies/company.enum';
import { StatusColorHelper } from '@app/shared/utils/status-color-helper';

@Pipe({
  name: 'statusColor',
  standalone: true
})
export class StatusColorPipe implements PipeTransform {
  transform(
    value: CompanyMemberAccountStateType | CompanyStateType,
    param: 'companyMemberAccountState' | 'companyState'
  ): StatusColorsEnum {
    if (param === 'companyMemberAccountState') {
      return StatusColorHelper.getCompanyMemberAccountStateStatusColor(<CompanyMemberAccountStateType>value);
    }

    if (param === 'companyState') {
      return StatusColorHelper.getCompanyStateStatusColor(<CompanyStateType>value);
    }

    return StatusColorsEnum.DEFAULT;
  }
}
