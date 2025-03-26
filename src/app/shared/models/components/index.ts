import { EventEmitter, TemplateRef } from '@angular/core';
import { Company } from '@app/shared/models';

export interface Submittable {
  actionsTemplateEvent?: EventEmitter<TemplateRef<HTMLElement>>;
  hasChangedData(): boolean;
  restoreForm(): void;
  setFormData(data: Company): void;
  loadData(): void;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ComponentType<T> = new (...args: any[]) => T;

export interface CommonCustomerComponentActions {
  navigateBack(): void;
}
