export enum StatusColorsEnum {
  SUCCESS = 'success',
  DANGER = 'danger',
  WARNING = 'warning',
  DEFAULT = ''
}

export type StatusColorsType =
  | StatusColorsEnum.SUCCESS
  | StatusColorsEnum.DANGER
  | StatusColorsEnum.WARNING
  | StatusColorsEnum.DEFAULT;
