import { AccountNaturalBalanceType, AccountTypeType } from '@app/shared/models/accounts/account.enum';

export class Account {
  readonly id!: string;
  name!: string;
  number!: number;
  naturalBalance!: AccountNaturalBalanceType;
  type!: AccountTypeType;
  subtype?: string;
  description!: string;
  readonly archived?: boolean;
  companyId!: string;
  readonly createdAt?: string;

  constructor(data: Partial<Account>) {
    Object.assign(this, data);
  }
}
