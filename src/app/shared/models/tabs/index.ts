export interface Tab {
  text: string;
  route: string;
  disabled?: boolean;
}

export interface ItemClickEvent<T> {
  itemData: T;
}
