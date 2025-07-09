import { inject, Injectable } from '@angular/core';
import { CompanyAddAccountComponent } from '@views/companies/company/accounts/add/company-add-account.component';
import { DxPopupService, DxPopupTypes } from 'devextreme-angular/ui/popup';
import { custom } from 'devextreme/ui/dialog';

@Injectable({
  providedIn: 'root'
})
export class DialogService {
  private popupService = inject(DxPopupService);

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

  openPopup(component: typeof CompanyAddAccountComponent, popupOptions: DxPopupTypes.Properties) {
    const defaultOptions = {
      width: 940,
      height: 400,
      showTitle: true,
      dragEnabled: false,
      hideOnOutsideClick: true,
      showCloseButton: true
    };
    const popupRef = this.popupService.open(component, { ...defaultOptions, ...popupOptions });

    popupRef.contentRef.instance.setPopupRef(popupRef.instance);

    return popupRef.contentRef.instance.closeEvent;
  }
}
