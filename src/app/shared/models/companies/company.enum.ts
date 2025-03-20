export enum CompanyContractEnum {
  BP_ONLY = 'BP_ONLY',
  FREE = 'FREE'
}

export type CompanyContractType = 'BP_ONLY' | 'FREE';

export enum CompanyState {
  ACTIVE = 'ACTIVE',
  ARCHIVED = 'ARCHIVED',
  PENDING = 'PENDING'
}

export type CompanyStateType = 'ACTIVE' | 'ARCHIVED' | 'PENDING';

export enum CompanyMemberAccountState {
  WAIT_APPROVAL = 'WAIT_APPROVAL',
  APPROVED = 'APPROVED',
  HOLD = 'HOLD',
  UPDATE_REQUIRED = 'UPDATE_REQUIRED',
  DECLINED = 'DECLINED'
}

export type CompanyMemberAccountStateType = 'WAIT_APPROVAL' | 'APPROVED' | 'HOLD' | 'UPDATE_REQUIRED' | 'DECLINED';
