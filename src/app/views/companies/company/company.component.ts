import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, TemplateRef, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { Tab } from '@app/shared/models';
import { CommonCustomerComponentActions, Submittable } from '@app/shared/models/components';
import { DetailsToolbarComponent } from '@components/details-toolbar/details-toolbar.component';
import { DialogService } from '@services/helpers/dialog.service';
import { CompanyHelperService } from '@views/companies/company/company-helper.service';
import { CompanyStateService } from '@views/companies/company/company-state.service';
import { DxTabsComponent, DxTemplateDirective } from 'devextreme-angular';
import { first } from 'rxjs';

@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    DetailsToolbarComponent,
    DxTabsComponent,
    RouterOutlet,
    NgTemplateOutlet,
    RouterLink,
    RouterLinkActive,
    DxTemplateDirective
  ]
})
export class CompanyComponent implements OnInit, OnDestroy {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private companyHelperService = inject(CompanyHelperService);
  private companyStateService = inject(CompanyStateService);
  private dialogService = inject(DialogService);

  currentCompany = this.companyStateService.currentCompany;

  tabs: Tab[] = this.companyHelperService.getTabs();
  activeComponent!: Submittable & CommonCustomerComponentActions;
  actionsTemplate = signal<TemplateRef<HTMLElement> | null>(null);
  companyId!: string;

  ngOnInit(): void {
    this.handleCompanyLoad();
  }

  ngOnDestroy(): void {
    this.companyStateService.resetCurrentCompany();
  }

  private handleCompanyLoad(): void {
    this.companyId = this.route.snapshot.paramMap.get('companyId') || '';
    this.companyStateService.runCompanyLoad(this.companyId);
  }

  onReturnBack(): void {
    this.activeComponent.navigateBack();
  }

  onActivateRoute(component: Submittable & CommonCustomerComponentActions): void {
    this.activeComponent = component;

    if (this.activeComponent.actionsTemplateEvent) {
      this.activeComponent.actionsTemplateEvent.pipe(first()).subscribe(template => {
        this.actionsTemplate.set(template);
      });
    } else {
      this.actionsTemplate.set(null);
    }
  }

  onSelectTab(event: MouseEvent, tab: Tab): void {
    event.stopPropagation();

    new Promise(resolve => {
      if (this.activeComponent.hasChangedData?.()) {
        resolve(this.dialogService.showConfirm('All unsaved data will be lost. Are you sure you want to continue?'));
      } else {
        resolve(true);
      }
    }).then(allow => {
      if (!allow) {
        return;
      }

      this.router.navigate([`./${tab.route}`], { relativeTo: this.route });
    });
  }
}
