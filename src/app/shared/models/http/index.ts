import { HttpErrorResponse } from '@angular/common/http';

export type ApiError = {
  message: string;
  code?: string;
  details?: Record<string, unknown>;
};

export type HttpError = { error: ApiError } & HttpErrorResponse;
