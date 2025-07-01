import { HttpErrorResponse } from '@angular/common/http';

export interface ApiError {
  message: string;
  code?: string;
  details?: Record<string, unknown>;
}

export interface HttpError extends HttpErrorResponse {
  error: ApiError;
}
