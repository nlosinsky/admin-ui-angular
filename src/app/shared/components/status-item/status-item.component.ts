import { CommonModule } from '@angular/common';
import { Component, ChangeDetectionStrategy, Input, NgModule, HostBinding } from '@angular/core';
import { StatusColorsEnum, StatusColorsType } from '@app/shared/models/common';

@Component({
  selector: 'app-status-item',
  templateUrl: './status-item.component.html',
  styleUrls: ['./status-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StatusItemComponent {
  @Input() text = '';
  @Input() type!: StatusColorsType;

  @HostBinding('class') class = 'status-item';

  readonly statusColors = StatusColorsEnum;
}

@NgModule({
  imports: [CommonModule],
  exports: [StatusItemComponent],
  declarations: [StatusItemComponent],
  providers: []
})
export class StatusItemModule {}
