import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { RouterLink, RouterLinkActive } from '@angular/router';
import { DropdownTypes, NavItem, UserDropdownItem } from '@components/sidenav/sidenav.model';
import { SidenavService } from '@components/sidenav/sidenav.service';
import { UserService } from '@services/data/user.service';
import { DxButtonComponent, DxDropDownButtonComponent } from 'devextreme-angular';
import { DxDropDownButtonTypes } from 'devextreme-angular/ui/drop-down-button';

@Component({
  selector: 'app-sidenav',
  templateUrl: 'sidenav.component.html',
  styleUrls: ['./sidenav.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DxButtonComponent, RouterLink, DxDropDownButtonComponent, RouterLinkActive, NgOptimizedImage]
})
export class SidenavComponent {
  private service = inject(SidenavService);
  private userService = inject(UserService);

  currentUser = this.userService.getCurrentUser();

  items: NavItem[] = this.service.getNavItems();
  userDropdownItems: UserDropdownItem[] = this.service.getProfileDropdownItems();

  onUserDropdownAction(event: DxDropDownButtonTypes.ItemClickEvent): void {
    const eventId = event?.itemData?.id;

    if (eventId === DropdownTypes.LOGOUT) {
      this.logout();
    }
  }

  private logout(): void {
    this.service.logout();
  }
}
