import { CompanyContractType, CompanyStateType } from '@app/shared/models/companies/company.enum';

export interface CompanyContract {
  type: CompanyContractType;
  basisPoints: number;
}

export interface CompanyFeatures {
  accounting: boolean;
  advancedReporting: boolean;
  contractInventory: boolean;
  marketData: boolean;
  onlineTransactions: boolean;
}

export interface CompanyUpdateDTO {
  name: string;
  website?: string;
  streetAddress?: string;
  city?: string;
  state?: string;
  country?: string;
  zipCode?: string;
  companyState?: CompanyStateType;
}
