import { NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
    selector: 'app-avatar-box',
    templateUrl: './avatar-box.component.html',
    styleUrls: ['./avatar-box.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [NgIf]
})
export class AvatarBoxComponent {
  @Input() avatar = '';

  @Input() text = '';

  @Input() link = false;

  @Output() itemClicked = new EventEmitter<void>();

  onClick(event: MouseEvent): void {
    event.preventDefault();
    this.itemClicked.emit();
  }
}
