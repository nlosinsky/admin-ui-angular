import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

import { DxButtonModule } from 'devextreme-angular';

@Component({
  selector: 'app-details-toolbar',
  templateUrl: './details-toolbar.component.html',
  styleUrls: ['./details-toolbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DxButtonModule]
})
export class DetailsToolbarComponent {
  readonly title = input('');

  readonly logo = input('');

  readonly back = output<void>();

  onBack(): void {
    this.back.emit();
  }
}
