import { StatusColorsEnum, StatusColorsType } from '@app/shared/models/common';
import {
  CompanyMemberAccountState,
  CompanyMemberAccountStateType,
  CompanyState,
  CompanyStateType
} from '@app/shared/models/companies/company.enum';

export class StatusColorHelper {
  static getCompanyMemberAccountStateStatusColor(state: CompanyMemberAccountStateType): StatusColorsType {
    switch (state) {
      case CompanyMemberAccountState.APPROVED:
        return StatusColorsEnum.SUCCESS;

      case CompanyMemberAccountState.HOLD:
      case CompanyMemberAccountState.UPDATE_REQUIRED:
      case CompanyMemberAccountState.WAIT_APPROVAL:
        return StatusColorsEnum.WARNING;

      default:
        return StatusColorsEnum.DEFAULT;
    }
  }

  static getCompanyStateStatusColor(state: CompanyStateType): StatusColorsType {
    switch (state) {
      case CompanyState.ACTIVE:
        return StatusColorsEnum.SUCCESS;

      case CompanyState.ARCHIVED:
        return StatusColorsEnum.DANGER;

      default:
        return StatusColorsEnum.DEFAULT;
    }
  }
}
