import { CompanyContract, CompanyFeatures } from '@app/shared/models';
import { CompanyMemberAccountStateType, CompanyStateType } from '@app/shared/models/companies/company.enum';

export class CompanyMember {
  id!: string;
  email!: string;
  firstName!: string;
  lastName!: string;
  profilePictureUrl!: string;
  fullName: string;
  accountState!: CompanyMemberAccountStateType;
  companyId!: string;
  title!: string;
  callingCode!: string;
  workPhone!: string;

  constructor(input: unknown = {}) {
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
      displayName = this.email;
    }

    return displayName;
  }

  get userAvatar(): string {
    return this.profilePictureUrl || '/assets/images/unknown-face.png';
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
  contract!: CompanyContract;
  features!: CompanyFeatures;
  createdAt!: string;
  totals!: {
    crmAccounts: number;
    users: number;
  };

  constructor(input: unknown = {}) {
    Object.assign(this, input);
  }
}
