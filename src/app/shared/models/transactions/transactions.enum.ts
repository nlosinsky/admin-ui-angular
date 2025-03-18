export enum TransactionsSeries {
  Daily = 'Daily',
  Monthly = 'Monthly',
  Quarterly = 'Quarterly',
  Yearly = 'Yearly'
}

export type TickIntervalType = '' | 'month' | 'quarter' | 'year';

export type AggregationIntervalType = 'day' | 'month' | 'quarter' | 'year';
