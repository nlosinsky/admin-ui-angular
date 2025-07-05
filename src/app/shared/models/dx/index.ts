import dxDataGrid from 'devextreme/ui/data_grid';

export type DxGridExportingEvent = {
  cancel: boolean;
  component: dxDataGrid;
  element: HTMLElement;
  format: string;
  filename: string;
  data: Blob;
};

export type ExportGridExcelCell = {
  value: unknown;
  alignment: {
    horizontal: string;
  };
};
