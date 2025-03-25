import { NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

import { DxButtonModule } from 'devextreme-angular';

@Component({
    selector: 'app-details-toolbar',
    templateUrl: './details-toolbar.component.html',
    styleUrls: ['./details-toolbar.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
      NgIf,
        DxButtonModule
    ]
})
export class DetailsToolbarComponent {
  @Input() title = '';

  @Input() logo = '';

  @Output() back = new EventEmitter<void>();

  onBack(): void {
    this.back.emit();
  }
}
