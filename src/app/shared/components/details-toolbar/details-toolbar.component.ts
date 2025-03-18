import { CommonModule } from '@angular/common';
import { Component, ChangeDetectionStrategy, Input, EventEmitter, Output, NgModule } from '@angular/core';

import { DxButtonModule } from 'devextreme-angular';

@Component({
  selector: 'app-details-toolbar',
  templateUrl: './details-toolbar.component.html',
  styleUrls: ['./details-toolbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DetailsToolbarComponent {
  @Input() title = '';

  @Input() logo = '';

  @Output() back = new EventEmitter<void>();

  onBack(): void {
    this.back.emit();
  }
}

@NgModule({
  imports: [CommonModule, DxButtonModule],
  exports: [DetailsToolbarComponent],
  declarations: [DetailsToolbarComponent],
  providers: []
})
export class DetailsToolbarModule {}
