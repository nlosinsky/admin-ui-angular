import { formatNumber } from '@angular/common';
import { locale } from 'devextreme/localization';

export class DocumentsStat {
  company!: {
    name: string;
    id: string;
  };
  id!: string;
  name!: string;
  count!: number;
  sizeKb!: number;

  constructor(input: Partial<DocumentsStat> = {}) {
    Object.assign(this, input);
  }

  get sizeMb(): string {
    return formatNumber((this.sizeKb || 0) / 1024, locale(), '1.0-2');
  }
}
