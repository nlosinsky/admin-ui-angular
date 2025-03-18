import { Component, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { DxPopupComponent, DxValidatorComponent } from 'devextreme-angular';
import { Observable, Subject } from 'rxjs';

@Component({
  template: ''
})
export abstract class PopupBaseComponent {
  @ViewChild(DxPopupComponent) popupElem!: DxPopupComponent;
  @ViewChildren(DxValidatorComponent) validators!: QueryList<DxValidatorComponent>;

  close$: Observable<unknown>;
  private closeSubj = new Subject<unknown>();

  constructor() {
    this.close$ = this.closeSubj.asObservable();
  }

  protected close(data: unknown) {
    this.closeSubj.next(data);
  }
}
