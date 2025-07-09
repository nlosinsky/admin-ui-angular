import { inject, Injectable, signal } from '@angular/core';
import { HttpError } from '@app/shared/models';
import { User } from '@app/shared/models/user';
import { UserApiService } from '@services/api/user-api.service';
import { ToastService } from '@services/helpers/toast.service';
import { EMPTY, Observable, Subject } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private userApiService = inject(UserApiService);
  private toastService = inject(ToastService);
  private loadUserSubj = new Subject<void>();
  private _currentUser = signal<User | null>(null);

  currentUser = this._currentUser.asReadonly();

  constructor() {
    this.loadUserSubj
      .asObservable()
      .pipe(switchMap(() => this.getCurrentUser()))
      .subscribe((user: User) => {
        this._currentUser.set(user);
      });
  }

  runUserLoad(): void {
    this.loadUserSubj.next();
  }

  private getCurrentUser(): Observable<User> {
    return this.userApiService.getCurrentUser().pipe(
      catchError((error: HttpError) => {
        this.toastService.showHttpError(error);
        return EMPTY;
      })
    );
  }
}
