import { CommonModule } from '@angular/common';
import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter, NgModule } from '@angular/core';

@Component({
  selector: 'app-avatar-box',
  templateUrl: './avatar-box.component.html',
  styleUrls: ['./avatar-box.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
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

@NgModule({
  imports: [CommonModule],
  exports: [AvatarBoxComponent],
  declarations: [AvatarBoxComponent],
  providers: []
})
export class AvatarBoxModule {}
