import { AccountNaturalBalanceType, AccountTypeType } from '@app/shared/models/accounts/account.enum';

export type AccountDTO = {
  name: string;
  number: number;
  naturalBalance: AccountNaturalBalanceType;
  type: AccountTypeType;
  subtype?: string;
  description?: string;
  archived?: boolean;
  companyId: string;
};
