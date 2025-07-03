import { inject, Injectable, Signal } from '@angular/core';
import { User } from '@app/shared/models';
import { DropdownTypes, NavItem, UserDropdownItem } from '@components/sidenav/sidenav.model';
import { AuthService } from '@services/data/auth.service';
import { UserService } from '@services/data/user.service';

@Injectable({ providedIn: 'root' })
export class SidenavService {
  private authService = inject(AuthService);
  private userService = inject(UserService);

  getCurrentUser(): Signal<User | null> {
    return this.userService.currentUser;
  }

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
