export interface NavItem {
  route: string;
  label: string;
  disabled?: boolean;
}

export interface UserDropdownItem {
  id: string;
  text: string;
}

export enum DropdownTypes {
  LOGOUT = 'logout'
}
