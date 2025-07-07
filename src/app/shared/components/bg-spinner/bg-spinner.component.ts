import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-bg-spinner',
  templateUrl: './bg-spinner.component.html',
  styleUrls: ['./bg-spinner.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BgSpinnerComponent {}
