import { Signal, TemplateRef } from '@angular/core';
import { Company } from '@app/shared/models';

export type Submittable = {
  hasChangedData(): boolean;
  restoreForm(): void;
  setFormData(data: Company): void;
  loadData?(): void;
};

export type TabWithActions = {
  actionsTpl: Signal<TemplateRef<HTMLElement>>;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ComponentType<T> = new (...args: any[]) => T;
// eslint-enable-next-line @typescript-eslint/no-explicit-any

export type CommonCustomerComponentActions = {
  navigateBack(): void;
};
