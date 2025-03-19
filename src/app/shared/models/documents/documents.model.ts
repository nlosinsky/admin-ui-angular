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
}
