export type NavItem = {
  route: string;
  label: string;
  disabled?: boolean;
};

export type UserDropdownItem = {
  id: string;
  text: string;
};

export enum DropdownTypes {
  LOGOUT = 'logout'
}
