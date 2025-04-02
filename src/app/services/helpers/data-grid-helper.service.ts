import { Injectable } from '@angular/core';
import { DxGridExportingEvent, ExportGridExcelCell } from '@app/shared/models';
import { DxDataGridComponent } from 'devextreme-angular';
import { DataGridCell, exportDataGrid } from 'devextreme/excel_exporter';
import dxDataGrid from 'devextreme/ui/data_grid';
import { saveAs } from 'file-saver';
import { Workbook } from 'exceljs';

@Injectable({
  providedIn: 'root'
})
export class DataGridHelperService {
  openTableChooser(dataGrid: DxDataGridComponent): void {
    dataGrid.instance.showColumnChooser();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const columnChooserView = (dataGrid.instance as any).getView('columnChooserView');
    // eslint-enable-next-line @typescript-eslint/no-explicit-any

    if (!columnChooserView._popupContainer) {
      columnChooserView._initializePopupContainer();
      columnChooserView.render();
    }

    columnChooserView._popupContainer.option('position', {
      of: '.grid-column-chooser-btn',
      my: 'right top',
      at: 'right bottom'
    });
  }

  exportToExcel(
    component: dxDataGrid,
    fileName: string,
    customizeCell?: (gridCell: DataGridCell, excelCell: ExportGridExcelCell) => void
  ) {
    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet();

    exportDataGrid({
      component,
      worksheet: worksheet,
      customizeCell: options => {
        const { gridCell, excelCell } = options;

        if (customizeCell && gridCell?.rowType === 'data' && excelCell) {
          customizeCell(gridCell, excelCell);
        }
      }
    })
      .then(() => workbook.xlsx.writeBuffer())
      .then((buffer: BlobPart) => {
        const blob = new Blob([buffer], { type: 'application/octet-stream' });
        saveAs(blob, `${fileName}.xlsx`);
      });
  }

  exportToExcelFromEvent(
    e: DxGridExportingEvent,
    fileName: string,
    customizeCell?: (gridCell: DataGridCell, excelCell: ExportGridExcelCell) => void
  ) {
    this.exportToExcel(e.component, fileName, customizeCell);
    e.cancel = true;
  }
}
