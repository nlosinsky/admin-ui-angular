export class User {
  id!: string;
  email!: string;
  firstName!: string;
  lastName!: string;
  profilePictureUrl!: string;
  password!: string;
  fullName: string;

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
