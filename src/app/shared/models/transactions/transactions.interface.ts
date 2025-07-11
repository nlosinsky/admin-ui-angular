export type TransactionsSearchParamsValue = {
  startDate: Date;
  endDate: Date;
  companyId: string;
  userId: string;
};

export type TransactionsCount = {
  date: string;
  count: number;
  companyId: string;
  userId: string;
};
