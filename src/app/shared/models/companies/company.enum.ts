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

export enum InventoryMgmtSystem {
  FIFO = 'FIFO',
  AVG_COST = 'AVG_COST'
}

export type InventoryMgmtSystemType = 'FIFO' | 'AVG_COST';

export enum AutoInvoicingMethod {
  NONE = 'NONE',
  BOOKED = 'BOOKED',
  SHIPPED = 'SHIPPED'
}

export type AutoInvoicingMethodType = 'NONE' | 'BOOKED' | 'SHIPPED';

export enum RevenueRecognitionMethod {
  BOOKING = 'BOOKING',
  SHIPPED = 'SHIPPED',
  CUST_RECEIVED = 'CUST_RECEIVED',
  INVOICED = 'INVOICED',
  PAID = 'PAID'
}

export type RevenueRecognitionMethodType = 'BOOKING' | 'SHIPPED' | 'CUST_RECEIVED' | 'INVOICED' | 'PAID';

export enum FiscalYearStart {
  JAN = 'JAN',
  FEB = 'FEB',
  MAR = 'MAR',
  APR = 'APR',
  MAY = 'MAY',
  JUN = 'JUN',
  JUL = 'JUL',
  AUG = 'AUG',
  SEPT = 'SEPT',
  OCT = 'OCT',
  NOV = 'NOV',
  DEC = 'DEC'
}

export type FiscalYearStartType =
  | 'JAN'
  | 'FEB'
  | 'MAR'
  | 'APR'
  | 'MAY'
  | 'JUN'
  | 'JUL'
  | 'AUG'
  | 'SEPT'
  | 'OCT'
  | 'NOV'
  | 'DEC';

export enum SelectionCriteria {
  FIFO_LANDED_DATE = 'FIFO_LANDED_DATE',
  LIFO_LANDED_DATE = 'LIFO_LANDED_DATE',
  LOW_COST_BASIS = 'LOW_COST_BASIS',
  HIGH_COST_BASIS = 'HIGH_COST_BASIS',
  FIFO_ACQUIRED_DATE = 'FIFO_ACQUIRED_DATE',
  LIFO_ACQUIRED_DATE = 'LIFO_ACQUIRED_DATE'
}

export type SelectionCriteriaType =
  | 'FIFO_LANDED_DATE'
  | 'LIFO_LANDED_DATE'
  | 'LOW_COST_BASIS'
  | 'HIGH_COST_BASIS'
  | 'FIFO_ACQUIRED_DATE'
  | 'LIFO_ACQUIRED_DATE';

export enum CompanyMemberAccountState {
  NOT_ACTIVE = 'NOT_ACTIVE',
  WAIT_APPROVAL = 'WAIT_APPROVAL',
  APPROVED = 'APPROVED',
  HOLD = 'HOLD',
  UPDATE_REQUIRED = 'UPDATE_REQUIRED'
}

export type CompanyMemberAccountStateType = 'NOT_ACTIVE' | 'WAIT_APPROVAL' | 'APPROVED' | 'HOLD' | 'UPDATE_REQUIRED';
