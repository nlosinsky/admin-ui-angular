import { CommonModule } from '@angular/common';
import { Component, ChangeDetectionStrategy, Input, NgModule } from '@angular/core';

@Component({
  selector: 'app-general-toolbar',
  templateUrl: './general-toolbar.component.html',
  styleUrls: ['./general-toolbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GeneralToolbarComponent {
  @Input() title = '';

  @Input() subtitle = '';
}

@NgModule({
  imports: [CommonModule],
  exports: [GeneralToolbarComponent],
  declarations: [GeneralToolbarComponent],
  providers: []
})
export class GeneralToolbarModule {}
