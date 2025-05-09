import { AsyncPipe, NgForOf, NgIf, NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

import { RouterModule } from '@angular/router';
import { User } from '@app/shared/models/user';
import { DropdownTypes, NavItem, UserDropdownItem } from '@components/sidenav/sidenav.model';
import { SidenavService } from '@components/sidenav/sidenav.service';
import { DxButtonModule, DxDropDownButtonModule } from 'devextreme-angular';
import { Observable } from 'rxjs';
import { DxDropDownButtonTypes } from 'devextreme-angular/ui/drop-down-button';

@Component({
  selector: 'app-sidenav',
  templateUrl: 'sidenav.component.html',
  styleUrls: ['./sidenav.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgForOf, NgIf, AsyncPipe, RouterModule, DxButtonModule, DxDropDownButtonModule, NgOptimizedImage]
})
export class SidenavComponent implements OnInit {
  items: NavItem[] = [];

  userDropdownItems: UserDropdownItem[] = [];

  user$!: Observable<User>;

  constructor(private service: SidenavService) {}

  ngOnInit(): void {
    this.items = this.service.getNavItems();
    this.userDropdownItems = this.service.getProfileDropdownItems();
    this.user$ = this.service.getCurrentUser();
  }

  onUserDropdown(event: DxDropDownButtonTypes.ItemClickEvent): void {
    const eventId = event?.itemData?.id;

    if (eventId === DropdownTypes.LOGOUT) {
      this.logout();
    }
  }

  trackBy(index: number, item: NavItem): string {
    return item.route;
  }

  private logout(): void {
    this.service.logout();
  }
}
