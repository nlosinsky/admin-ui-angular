import { Component, ChangeDetectionStrategy, input } from '@angular/core';
import { StatusColorsEnum, StatusColorsType } from '@app/shared/models/common';

@Component({
  selector: 'app-status-item',
  templateUrl: './status-item.component.html',
  styleUrls: ['./status-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'statusItemClassName'
  }
})
export class StatusItemComponent {
  readonly text = input.required();
  readonly type = input.required<StatusColorsType>();
  readonly statusItemClassName = 'status-item';
  readonly statusColors = StatusColorsEnum;
}
