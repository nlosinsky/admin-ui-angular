/* eslint-disable max-classes-per-file */
import { CompanyContract, CompanyFeatures } from '@app/shared/models';
import {
  AutoInvoicingMethodType,
  CompanyContractType,
  CompanyMemberAccountStateType,
  CompanyStateType,
  FiscalYearStartType,
  InventoryMgmtSystemType,
  RevenueRecognitionMethodType,
  SelectionCriteriaType
} from '@app/shared/models/companies/company.enum';

abstract class Member {
  id!: string;
  username!: string;
  firstName!: string;
  lastName!: string;
  profilePictureUrl!: string;
  fullName: string;

  constructor(input: Partial<Member>) {
    Object.assign(this, input);

    this.fullName = this.getFullName();
  }

  private getFullName(): string {
    let displayName = '';

    if (this.firstName && this.lastName) {
      displayName = `${this.firstName} ${this.lastName}`;
    } else if (this.firstName) {
      displayName = this.firstName;
    } else if (this.lastName) {
      displayName = this.lastName;
    } else {
      displayName = this.username;
    }

    return displayName;
  }

  get userAvatar(): string {
    return this.profilePictureUrl || '/assets/images/unknown-face.png';
  }
}

export class CompanyPendingMember extends Member {
  title!: string;
  callingCode!: string;
  workPhone!: string;

  constructor(input: Partial<CompanyPendingMember> = {}) {
    super(input);
  }
}

export class CompanyMember extends Member {
  accountState!: CompanyMemberAccountStateType;

  constructor(input: Partial<CompanyMember> = {}) {
    super(input);
  }
}

export class CompanySummary {
  id!: string;
  name!: string;
  contract!: {
    type: CompanyContractType;
    basisPoints: number;
  };
  totals!: {
    crmAccounts: number;
    users: number;
  };
  createdAt!: string;

  constructor(input: Partial<CompanySummary>) {
    Object.assign(this, input);
  }
}

export class TemporaryCompany {
  id!: string;
  name!: string;

  constructor(input: Partial<TemporaryCompany>) {
    Object.assign(this, input);
  }
}

export class Company {
  id!: string;
  name!: string;
  website!: string;
  streetAddress!: string;
  city!: string;
  state!: string;
  country!: string;
  zipCode!: string;
  logoUrl!: string;
  companyState!: CompanyStateType;
  accountingPractices!: {
    inventoryMgmtSystem: InventoryMgmtSystemType;
    fiscalYearStart: FiscalYearStartType;
    revenueRecognitionMethod: RevenueRecognitionMethodType;
    autoInvoicingMethod: AutoInvoicingMethodType;
    defaultBillToContact: string;
    defaultBillToLocation: string;
    defaultAccounts: {
      accountsPayable: number;
      accountsReceivable: number;
      cogsFees: number;
      cogsOther: number;
      cogsShipping: number;
      expense: number;
      inventoryInTransit: number;
      inventoryOnConsignment: number;
      inventoryOnHand: number;
      inventoryOnOrder: number;
      inventoryRawMaterials: number;
      retainedEarnings: number;
      revenue: number;
      taxExpense: number;
    };
  };
  privacySettings!: {
    allowListing: boolean;
    linkedCompanies: string[];
  };
  salesPractices!: {
    selectionCriteria: SelectionCriteriaType;
  };
  contract!: CompanyContract;
  features!: CompanyFeatures;
  credentials: unknown;
  createdAt!: string;
  updatedAt!: string;

  constructor(input: Partial<Company>) {
    Object.assign(this, input);
  }
}
