import { Injectable } from '@angular/core';
import { HttpError } from '@app/shared/models';
import { PlatformHelperService } from '@services/helpers/platform-helper.service';
import notify from 'devextreme/ui/notify';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  constructor(private platformHelperService: PlatformHelperService) {}

  showSuccess(message: string): void {
    this.showToast(message, 'success');
  }

  showError(message = 'Something went wrong!'): void {
    this.showToast(message, 'error');
  }

  showHttpError(error: HttpError): void {
    const message = error.error?.message || error.message || 'Something unexpected happened. Please try again';
    this.showToast(message, 'error');
  }

  private showToast(message: string, type: string): void {
    if (!message || this.platformHelperService.isServer()) {
      return;
    }
    const displayTime = Math.min(Math.max(message.length * 50, 2000), 7000);

    notify({
      message,
      type,
      displayTime,
      position: {
        my: 'top right',
        at: 'top right',
        of: window,
        offset: '-10 10'
      },
      minWidth: 250,
      maxWidth: 350,
      width: 'auto'
    });
  }
}
