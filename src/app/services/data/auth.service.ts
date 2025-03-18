import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { LoginCredentials } from '@app/shared/models/auth';
import { AuthApiService } from '@services/api/auth-api.service';
import { StorageHelperService } from '@services/helpers/storage-helper.service';
import { TokenHelperService } from '@services/helpers/token-helper.service';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(
    private authApiService: AuthApiService,
    private storage: StorageHelperService,
    private token: TokenHelperService,
    private router: Router
  ) {}

  login(credentials: LoginCredentials): Observable<{ allow: boolean; message: string }> {
    return this.authApiService.login(credentials).pipe(
      map(token => {
        if (token.scope === 'access:company:admin') {
          this.storage.setTokenData(token);
          return { allow: true, message: '' };
        }

        return { allow: false, message: "You don't have permission to access" };
      }),
      catchError((error: HttpErrorResponse) => {
        let errorMessage = '';

        if (error?.status === 404) {
          errorMessage = 'The username you have entered not found.';
        } else if (error?.status === 401) {
          errorMessage = 'The password you have entered is incorrect.';
        } else {
          errorMessage = 'Something unexpected happened, please try again.';
        }

        return throwError(errorMessage);
      })
    );
  }

  logout(keepCurrentUrl = false): void {
    this.storage.clear();

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
    return this.token.isTokenValid;
  }
}
