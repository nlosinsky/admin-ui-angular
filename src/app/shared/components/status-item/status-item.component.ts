import { NgClass } from '@angular/common';
import { Component, ChangeDetectionStrategy, Input, HostBinding } from '@angular/core';
import { StatusColorsEnum, StatusColorsType } from '@app/shared/models/common';

@Component({
  selector: 'app-status-item',
  templateUrl: './status-item.component.html',
  styleUrls: ['./status-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgClass]
})
export class StatusItemComponent {
  @Input() text = '';
  @Input() type!: StatusColorsType;

  @HostBinding('class') class = 'status-item';

  readonly statusColors = StatusColorsEnum;
}
