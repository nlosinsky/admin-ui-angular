import { CommonModule } from '@angular/common';
import { Component, ChangeDetectionStrategy, Input } from '@angular/core';

@Component({
  selector: 'app-general-toolbar',
  templateUrl: './general-toolbar.component.html',
  styleUrls: ['./general-toolbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    CommonModule
  ]
})
export class GeneralToolbarComponent {
  @Input() title = '';

  @Input() subtitle = '';
}
