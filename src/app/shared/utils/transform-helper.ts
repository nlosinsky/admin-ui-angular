import { CompanyContractEnum, CompanyContractType } from '@app/shared/models/companies/company.enum';
import { isString } from 'lodash-es';

export class TransformHelper {
  static stringValueCapitalize(value: unknown) {
    if (!value || !isString(value)) {
      return '';
    }

    return value
      .toLowerCase()
      .split('_')
      .map(part => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ');
  }

  static contractType(type: CompanyContractType) {
    switch (type) {
      case CompanyContractEnum.FREE:
        return 'Free';
      case CompanyContractEnum.BP_ONLY:
        return 'Basis Point Only';
      default:
        return '';
    }
  }
}
