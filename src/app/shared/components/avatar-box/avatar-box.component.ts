import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

@Component({
  selector: 'app-avatar-box',
  templateUrl: './avatar-box.component.html',
  styleUrls: ['./avatar-box.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: []
})
export class AvatarBoxComponent {
  readonly avatar = input.required();
  readonly text = input.required();
  readonly link = input(false);

  readonly itemClicked = output<void>();

  onClick(event: MouseEvent): void {
    event.preventDefault();
    this.itemClicked.emit();
  }
}
