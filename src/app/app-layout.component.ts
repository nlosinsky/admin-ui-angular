import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SidenavComponent } from '@components/sidenav/sidenav.component';
import { UserService } from '@services/data/user.service';

@Component({
    selector: 'app-app-layout',
    template: `
    <app-sidenav>
      <router-outlet></router-outlet>
    </app-sidenav>
  `,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        RouterModule,
        SidenavComponent
    ]
})
export class AppLayoutComponent implements OnInit {
  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.userService.runUserLoad();
  }
}
