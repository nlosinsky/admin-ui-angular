import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, Signal } from '@angular/core';

import { RouterModule } from '@angular/router';
import { User } from '@app/shared/models/user';
import { DropdownTypes, NavItem, UserDropdownItem } from '@components/sidenav/sidenav.model';
import { SidenavService } from '@components/sidenav/sidenav.service';
import { DxButtonModule, DxDropDownButtonModule } from 'devextreme-angular';
import { DxDropDownButtonTypes } from 'devextreme-angular/ui/drop-down-button';

@Component({
  selector: 'app-sidenav',
  templateUrl: 'sidenav.component.html',
  styleUrls: ['./sidenav.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterModule, DxButtonModule, DxDropDownButtonModule, NgOptimizedImage]
})
export class SidenavComponent {
  private service = inject(SidenavService);

  items: NavItem[] = this.service.getNavItems();
  userDropdownItems: UserDropdownItem[] = this.service.getProfileDropdownItems();

  currentUser: Signal<User | null> = this.service.getCurrentUser();

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
