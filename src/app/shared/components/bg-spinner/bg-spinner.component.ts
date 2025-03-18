import { ChangeDetectionStrategy, Component, NgModule } from '@angular/core';

@Component({
  selector: 'app-bg-spinner',
  templateUrl: './bg-spinner.component.html',
  styleUrls: ['./bg-spinner.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BgSpinnerComponent {}

@NgModule({
  imports: [],
  exports: [BgSpinnerComponent],
  declarations: [BgSpinnerComponent],
  providers: []
})
export class BgSpinnerModule {}
