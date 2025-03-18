import { HttpErrorResponse } from '@angular/common/http';

export interface HttpError extends HttpErrorResponse {
  error: { message: string };
}
