import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidenavComponent } from '@app/shared/components';

@Component({
  selector: 'app-app-layout',
  template: `
    <app-sidenav>
      <router-outlet />
    </app-sidenav>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SidenavComponent, RouterOutlet]
})
export class AppLayoutComponent {}
