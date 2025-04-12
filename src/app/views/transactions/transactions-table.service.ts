import { formatDate } from '@angular/common';
import { Inject, Injectable, LOCALE_ID } from '@angular/core';
import { CompanyMember, Company, HttpError } from '@app/shared/models';
import { TransactionsCount, TransactionsFormValue, TransactionsSeries } from '@app/shared/models/transactions';
import { CompaniesService } from '@services/data/companies.service';
import { TransactionsService } from '@services/data/transactions.service';
import { PlatformHelperService } from '@services/helpers/platform-helper.service';
import { ToastService } from '@services/helpers/toast.service';
import { Canvg } from 'canvg';
import { addMilliseconds, endOfDay, getQuarter, startOfDay, subMilliseconds } from 'date-fns';
import { DxChartComponent } from 'devextreme-angular';
import { TimeInterval } from 'devextreme/common/charts';
import { exportFromMarkup } from 'devextreme/viz/export';
import { EMPTY } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

const yearQuarters = ['January - March', 'April - June', 'July - September', 'October - December'];

@Injectable({
  providedIn: 'root'
})
export class TransactionsTableService {
  constructor(
    @Inject(LOCALE_ID) private localeId: string,
    private transactionsService: TransactionsService,
    private toastService: ToastService,
    private companiesService: CompaniesService,
    private platformHelperService: PlatformHelperService
  ) {}

  getMembers(companyId: string) {
    return this.companiesService.getMembers(companyId).pipe(
      map(members => {
        return [{ fullName: 'All', id: '' } as CompanyMember].concat(members);
      })
    );
  }

  getCompanies() {
    return this.companiesService.getCompanies().pipe(
      map(data => {
        return [{ name: 'All', id: '' } as Company].concat(data);
      })
    );
  }

  getTransactionsCount(payload: TransactionsFormValue) {
    return this.transactionsService.getTransactionsCount(payload).pipe(
      map(resp => this.formatItemsResp(resp)),
      catchError((error: HttpError) => {
        this.toastService.showHttpError(error);
        return EMPTY;
      })
    );
  }

  getSearchPayload(formValue: Partial<TransactionsFormValue>): TransactionsFormValue {
    const { startDate, endDate, userId, companyId } = formValue;
    return {
      startDate: startDate ? startOfDay(startDate) : new Date(),
      endDate: endDate ? endOfDay(endDate) : new Date(),
      userId: userId || '',
      companyId: companyId || ''
    };
  }

  private formatItemsResp(items: TransactionsCount[]) {
    if (items.length !== 1) {
      return items;
    }

    const item = items[0];
    const date = new Date(item.date);
    const fakeDate = date.getMilliseconds() > 1 ? subMilliseconds(date, 1) : addMilliseconds(date, 1);

    return [item].concat({ count: 0, date: fakeDate.toISOString(), companyId: '', userId: '' });
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
