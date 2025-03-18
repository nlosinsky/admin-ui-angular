import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { UserService } from '@services/data/user.service';

@Component({
  selector: 'app-app-layout',
  template: `
    <app-sidenav>
      <router-outlet></router-outlet>
    </app-sidenav>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppLayoutComponent implements OnInit {
  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.userService.runUserLoad();
  }
}
