export interface TransactionsFormValue {
  startDate: Date;
  endDate: Date;
  companyId: string;
  userId: string;
}

export interface TransactionsCount {
  date: string;
  count: number;
  companyId: string;
  userId: string;
}
