import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, TemplateRef } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Company, Tab } from '@app/shared/models';
import { CommonCustomerComponentActions, Submittable } from '@app/shared/models/components';
import { DetailsToolbarComponent } from '@components/details-toolbar/details-toolbar.component';
import { DialogService } from '@services/helpers/dialog.service';
import { CompanyHelperService } from '@views/companies/company/company-helper.service';
import { CompanyStateService } from '@views/companies/company/company-state.service';
import { DxTabsModule } from 'devextreme-angular';
import { first, Observable, Subject } from 'rxjs';

@Component({
    selector: 'app-company',
    templateUrl: './company.component.html',
    styleUrls: ['./company.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        CommonModule,
        RouterModule,
        DetailsToolbarComponent,
        DxTabsModule,
    ]
})
export class CompanyComponent implements OnInit, OnDestroy {
  tabs: Tab[] = [];
  currentCompany$!: Observable<Company | null>;
  activeComponent!: Submittable & CommonCustomerComponentActions;
  actionsTemplate!: TemplateRef<HTMLElement> | null;
  companyId!: string;

  private ngUnsub = new Subject<void>();

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private companyHelperService: CompanyHelperService,
    private companyStateService: CompanyStateService,
    private cd: ChangeDetectorRef,
    private dialogService: DialogService
  ) {}

  ngOnInit(): void {
    this.handleCompanyLoad();
    this.tabs = this.companyHelperService.getTabs();
  }

  ngOnDestroy(): void {
    this.companyStateService.resetCurrentCompany();
    this.ngUnsub.next();
    this.ngUnsub.complete();
  }

  private handleCompanyLoad(): void {
    this.companyId = this.route.snapshot.paramMap.get('companyId') || '';
    this.companyStateService.runCompanyLoad(this.companyId);
    this.currentCompany$ = this.companyStateService.currentCompany$;
  }

  onReturnBack(): void {
    this.activeComponent.navigateBack();
  }

  onActivateRoute(component: Submittable & CommonCustomerComponentActions): void {
    this.activeComponent = component;
    this.actionsTemplate = null;

    if (this.activeComponent.actionsTemplateEvent) {
      this.activeComponent.actionsTemplateEvent.pipe(first()).subscribe(template => {
        this.actionsTemplate = template;
        this.cd.detectChanges();
      });
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
