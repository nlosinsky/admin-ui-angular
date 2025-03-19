import { CompanyMemberAccountStateType } from '@app/shared/models/companies/company.enum';

export class User {
  id!: string;
  username!: string;
  firstName!: string;
  lastName!: string;
  profilePictureUrl!: string;
  productsOfInterestIds!: string[];
  title!: string;
  callingCode!: string;
  workPhone!: string;
  accountState!: CompanyMemberAccountStateType;
  privacySettings!: {
    allowListing: boolean;
  };
  companyId!: string;
  temporaryCompanyId!: string;
  updatedAt!: Date;
  createdAt!: Date;
  fullName: string;

  constructor(input: Partial<User> = {}) {
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

export class PendingUser {
  id!: string;
  username!: string;
  accountState!: CompanyMemberAccountStateType;

  constructor(input: Partial<User> = {}) {
    Object.assign(this, input);
  }
}
