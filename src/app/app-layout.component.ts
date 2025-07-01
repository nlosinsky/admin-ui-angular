import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SidenavComponent } from '@components/sidenav/sidenav.component';
import { UserService } from '@services/data/user.service';

@Component({
  selector: 'app-app-layout',
  template: `
    <app-sidenav>
      <router-outlet />
    </app-sidenav>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterModule, SidenavComponent]
})
export class AppLayoutComponent implements OnInit {
  private userService = inject(UserService);

  ngOnInit(): void {
    this.userService.runUserLoad();
  }
}
