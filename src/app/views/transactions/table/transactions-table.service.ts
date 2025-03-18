import { formatDate } from '@angular/common';
import { Inject, Injectable, LOCALE_ID } from '@angular/core';
import { CompanyMember, CompanySummary, HttpError } from '@app/shared/models';
import {
  AggregationIntervalType,
  TickIntervalType,
  TransactionsCount,
  TransactionsCountDTO,
  TransactionsSeries
} from '@app/shared/models/transactions';
import { CompaniesService } from '@services/data/companies.service';
import { TransactionsService } from '@services/data/transactions.service';
import { ToastService } from '@services/helpers/toast.service';
import { TransactionsForm } from '@views/transactions/table/transactions-table.component';
import { Canvg } from 'canvg';
import { addMilliseconds, endOfDay, getQuarter, startOfDay, subMilliseconds } from 'date-fns';
import { DxChartComponent } from 'devextreme-angular';
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
    private companiesService: CompaniesService
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
        return [{ name: 'All', id: '' } as CompanySummary].concat(data);
      })
    );
  }

  getTransactionsCount(payload: TransactionsCountDTO) {
    return this.transactionsService.getTransactionsCount(payload).pipe(
      map(resp => this.formatItemsResp(resp)),
      catchError((error: HttpError) => {
        this.toastService.showHttpError(error);
        return EMPTY;
      })
    );
  }

  getSearchPayload(formValue: TransactionsForm): TransactionsCountDTO {
    const { startDate, endDate, userId, companyId } = formValue;
    const payload: TransactionsCountDTO = {
      startDate: startOfDay(new Date(startDate)),
      endDate: endOfDay(new Date(endDate))
    };

    // todo rewrite with deleteEmptyProperties
    if (userId) {
      payload.userId = userId;
    }

    if (companyId) {
      payload.companyId = companyId;
    }

    return payload;
  }

  private formatItemsResp(items: TransactionsCount[]) {
    if (items.length !== 1) {
      return items;
    }
    const item = items[0];
    const date = new Date(item.date);
    const fakeDate = date.getMilliseconds() > 1 ? subMilliseconds(date, 1) : addMilliseconds(date, 1);

    return [item].concat({ count: 0, date: fakeDate.toISOString() });
  }

  getTickInterval(value: TransactionsSeries): TickIntervalType {
    switch (value) {
      case TransactionsSeries.Daily:
        return '';

      case TransactionsSeries.Monthly:
        return 'month';

      case TransactionsSeries.Quarterly:
        return 'quarter';

      case TransactionsSeries.Yearly:
        return 'year';
    }
  }

  getAggregationInterval(value: TransactionsSeries): AggregationIntervalType {
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
