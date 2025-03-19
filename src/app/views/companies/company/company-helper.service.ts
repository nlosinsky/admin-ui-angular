import { Injectable } from '@angular/core';
import { Tab } from '@app/shared/models';

@Injectable({
  providedIn: 'root'
})
export class CompanyHelperService {
  getTabs(): Tab[] {
    return [
      {
        text: 'Information',
        route: 'information'
      },
      // {
      //   text: 'Users',
      //   route: 'users'
      // },
      {
        text: 'Contract',
        route: 'contract'
      },
      // {
      //   text: 'Accounts',
      //   route: 'accounts'
      // },
      // {
      //     text: 'Finance',
      //     route: 'finance'
      // }
    ];
  }

  getTabIndex(path: string): Tab | undefined {
    const tabs = this.getTabs();

    return tabs.find(item => item.route === path);
  }
}
