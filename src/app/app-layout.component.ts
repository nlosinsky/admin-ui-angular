import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SidenavComponent } from '@components/sidenav/sidenav.component';

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
export class AppLayoutComponent {}
