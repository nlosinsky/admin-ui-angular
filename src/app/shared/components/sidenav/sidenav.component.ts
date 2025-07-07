import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit, Signal } from '@angular/core';

import { RouterModule } from '@angular/router';
import { UserService } from '@app/services';
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
export class SidenavComponent implements OnInit {
  private service = inject(SidenavService);
  private userService = inject(UserService);

  items: NavItem[] = this.service.getNavItems();
  userDropdownItems: UserDropdownItem[] = this.service.getProfileDropdownItems();

  currentUser: Signal<User | null> = this.service.getCurrentUser();

  ngOnInit(): void {
    this.userService.runUserLoad();
  }

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
