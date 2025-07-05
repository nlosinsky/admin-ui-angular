import { CompanyContractType, CompanyStateType } from '@app/shared/models/companies/company.enum';

export type CompanyContract = {
  type: CompanyContractType;
  basisPoints: number;
};

export type CompanyFeatures = {
  accounting: boolean;
  advancedReporting: boolean;
  contractInventory: boolean;
  marketData: boolean;
  onlineTransactions: boolean;
};

export type CompanyUpdateDTO = {
  name: string;
  website?: string;
  streetAddress?: string;
  city?: string;
  state?: string;
  country?: string;
  zipCode?: string;
  companyState?: CompanyStateType;
};
