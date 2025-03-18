import dxDataGrid from 'devextreme/ui/data_grid';

export interface DxGridExportingEvent {
  cancel: boolean;
  component: dxDataGrid;
  element: HTMLElement;
  format: string;
  filename: string;
  data: Blob;
}

export interface ExportGridExcelCell {
  value: unknown;
  alignment: {
    horizontal: string;
  };
}
