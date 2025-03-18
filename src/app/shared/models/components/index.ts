import { EventEmitter, TemplateRef } from '@angular/core';
import { Company } from '@app/shared/models';

export interface Submittable {
  actionsTemplateEvent?: EventEmitter<TemplateRef<HTMLElement>>;
  hasChangedData(): boolean;
  restoreForm(): void;
  setFormData(data: Company): void;
  loadData(): void;
}

export declare interface ComponentType<T> extends Function {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  new (...args: any[]): T;
}

export interface CommonCustomerComponentActions {
  navigateBack(): void;
}
