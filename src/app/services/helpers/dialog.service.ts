import { Injectable, ViewContainerRef } from '@angular/core';
import { PopupBaseComponent } from '@app/shared/base/popup.base';
import { ComponentType } from '@app/shared/models/components';
import { custom } from 'devextreme/ui/dialog';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DialogService {
  showConfirm(message: string): Promise<boolean> {
    const customRef = custom({
      title: 'Confirm',
      messageHtml: `<div>${message}</div>`,
      buttons: [
        {
          text: 'No',
          stylingMode: 'outlined',
          elementAttr: { class: 'grayed' },
          type: 'normal',
          onClick: () => false
        },
        {
          text: 'Yes',
          stylingMode: 'contained',
          type: 'success',
          onClick: () => true
        }
      ]
    }) as { show(): Promise<unknown> };

    return customRef.show() as Promise<boolean>;
  }

  openPopup<T extends PopupBaseComponent>(viewRef: ViewContainerRef, component: ComponentType<T>): Observable<unknown> {
    viewRef.clear();
    const componentRef = viewRef.createComponent<T>(component);
    return componentRef.instance.close$;
  }
}
