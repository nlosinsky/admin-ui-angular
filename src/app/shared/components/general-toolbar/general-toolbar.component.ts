import { Component, ChangeDetectionStrategy, input } from '@angular/core';

@Component({
  selector: 'app-general-toolbar',
  templateUrl: './general-toolbar.component.html',
  styleUrls: ['./general-toolbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: []
})
export class GeneralToolbarComponent {
  readonly title = input('');
  readonly subtitle = input('');
}
