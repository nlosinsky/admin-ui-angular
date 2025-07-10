import { HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { LoginCredentials, Token } from '@app/shared/models/auth';
import { AuthApiService } from '@services/api/auth-api.service';
import { TokenHelperService } from '@services/helpers/token-helper.service';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private authApiService = inject(AuthApiService);
  private tokenHelperService = inject(TokenHelperService);
  private router = inject(Router);

  login(credentials: LoginCredentials): Observable<Token> {
    return this.authApiService.login(credentials).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = '';

        if (error?.status === 401) {
          errorMessage = 'The credentials you have entered are incorrect.';
        } else {
          errorMessage = 'Something unexpected happened, please try again.';
        }

        return throwError(() => errorMessage);
      })
    );
  }

  logout(keepCurrentUrl = false): void {
    this.tokenHelperService.clear();

    if (keepCurrentUrl) {
      const state = this.router.routerState.snapshot;
      if (!state.root.queryParamMap.has('returnUrl')) {
        this.router.navigate(['/auth/login'], { queryParams: { returnUrl: state.url } });
      }
    } else {
      this.router.navigate(['/auth/login']);
    }
  }

  isAuthenticated(): boolean {
    return this.tokenHelperService.hasCookie();
  }
}
