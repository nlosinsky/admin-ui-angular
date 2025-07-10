import { formatDate } from '@angular/common';
import { Injectable, LOCALE_ID, inject, Signal } from '@angular/core';
import { NonNullableFormBuilder, Validators } from '@angular/forms';
import { TransactionsSearchParamsValue, TransactionsSeries } from '@app/shared/models/transactions';
import { CompaniesService } from '@services/data/companies.service';
import { TransactionsService } from '@services/data/transactions.service';
import { PlatformHelperService } from '@services/helpers/platform-helper.service';
import { Canvg } from 'canvg';
import { endOfDay, getQuarter, startOfDay } from 'date-fns';
import { DxChartComponent } from 'devextreme-angular';
import { TimeInterval } from 'devextreme/common/charts';
import { exportFromMarkup } from 'devextreme/viz/export';

const yearQuarters = ['January - March', 'April - June', 'July - September', 'October - December'];

@Injectable({
  providedIn: 'root'
})
export class TransactionsTableService {
  private localeId = inject(LOCALE_ID);
  private transactionsService = inject(TransactionsService);
  private companiesService = inject(CompaniesService);
  private platformHelperService = inject(PlatformHelperService);
  private fb = inject(NonNullableFormBuilder);

  createForm() {
    return this.fb.group({
      startDate: [new Date(), Validators.required],
      endDate: [new Date(), Validators.required],
      companyId: [''],
      userId: ['']
    });
  }

  getMembers(companyId: Signal<string | null>) {
    return this.companiesService.getMembers(companyId);
  }

  getCompanies() {
    return this.companiesService.getCompanies();
  }

  getTransactionsCount(payload: Signal<TransactionsSearchParamsValue | null>) {
    return this.transactionsService.getTransactionsCount(payload);
  }

  getSearchParams(formValue: Partial<TransactionsSearchParamsValue>): TransactionsSearchParamsValue {
    let { startDate, endDate } = formValue;
    startDate = startDate ? startOfDay(startDate) : new Date();
    endDate = endDate ? endOfDay(endDate) : new Date();

    return {
      startDate: startDate,
      endDate: endDate,
      userId: formValue.userId || '',
      companyId: formValue.companyId || ''
    };
  }

  getTickInterval(value: TransactionsSeries): TimeInterval {
    switch (value) {
      case TransactionsSeries.Daily:
        return 'day';

      case TransactionsSeries.Monthly:
        return 'month';

      case TransactionsSeries.Quarterly:
        return 'quarter';

      case TransactionsSeries.Yearly:
        return 'year';
    }
  }

  customizeTooltip = (selectedSeriesValue: TransactionsSeries, info: { valueText: string; argument: Date }) => {
    const [value, text] = info.valueText.split('\n');
    const argument = info.argument;
    let date = text;

    if (selectedSeriesValue === TransactionsSeries.Daily) {
      date = formatDate(info.argument, 'mediumDate', this.localeId);
    } else if (selectedSeriesValue === TransactionsSeries.Quarterly) {
      const quarter = yearQuarters[getQuarter(argument) - 1];
      date = `${argument.getFullYear()}, ${quarter}`;
    }

    return {
      html: `
        <b>Count:</b> ${value}
        <br>
        <br>
        ${date}
     `
    };
  };

  onChartExport = (chart: DxChartComponent, format = 'png') => {
    return () => {
      if (this.platformHelperService.isServer()) {
        return;
      }

      const chartElem = document.getElementById('chart') as HTMLElement;
      const width = chartElem.clientWidth + 20;
      const height = chartElem.clientHeight + 20;

      exportFromMarkup(chart.instance.svg(), {
        width: width,
        height: height,
        fileName: 'transactions_count',
        margin: 10,
        format,
        svgToCanvas(svg: SVGElement, canvas: HTMLCanvasElement) {
          const ctx = canvas.getContext('2d');

          if (!ctx) {
            throw new Error('canvas context is undefined');
          }

          const v = Canvg.fromString(ctx, new XMLSerializer().serializeToString(svg), {
            ignoreDimensions: true,
            ignoreClear: true
          });

          v.start();
        }
      });
    };
  };
}
