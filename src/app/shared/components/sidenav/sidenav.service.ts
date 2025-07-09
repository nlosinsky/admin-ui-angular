import { inject, Injectable } from '@angular/core';
import { DropdownTypes, NavItem, UserDropdownItem } from '@components/sidenav/sidenav.model';
import { AuthService } from '@services/data/auth.service';

@Injectable({ providedIn: 'root' })
export class SidenavService {
  private authService = inject(AuthService);

  logout(): void {
    this.authService.logout();
  }

  getProfileDropdownItems(): UserDropdownItem[] {
    return [
      {
        id: DropdownTypes.LOGOUT,
        text: 'Logout'
      }
    ];
  }

  getNavItems(): NavItem[] {
    return [
      {
        route: 'companies',
        label: 'Customer Management'
      },
      {
        route: 'usage',
        label: 'Usage Data'
      },
      {
        route: 'transactions',
        label: 'Transactions'
      }
    ];
  }
}
