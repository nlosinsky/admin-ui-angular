export enum CompanyContractEnum {
  BP_ONLY = 'BP_ONLY',
  FREE = 'FREE'
}

export type CompanyContractType = 'BP_ONLY' | 'FREE';

export enum CompanyState {
  ACTIVE = 'ACTIVE',
  ARCHIVED = 'ARCHIVED'
}

export type CompanyStateType = 'ACTIVE' | 'ARCHIVED';

export enum CompanyMemberAccountState {
  NOT_ACTIVE = 'NOT_ACTIVE',
  WAIT_APPROVAL = 'WAIT_APPROVAL',
  APPROVED = 'APPROVED',
  HOLD = 'HOLD',
  UPDATE_REQUIRED = 'UPDATE_REQUIRED'
}

export type CompanyMemberAccountStateType = 'NOT_ACTIVE' | 'WAIT_APPROVAL' | 'APPROVED' | 'HOLD' | 'UPDATE_REQUIRED';
