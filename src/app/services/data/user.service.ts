import { Injectable } from '@angular/core';
import { HttpError } from '@app/shared/models';
import { User } from '@app/shared/models/user';
import { environment } from '@env/environment';
import { UserApiService } from '@services/api/user-api.service';
import { ToastService } from '@services/helpers/toast.service';
import { BehaviorSubject, EMPTY, Observable, Subject } from 'rxjs';
import { catchError, share, switchMap, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  currentUser$: Observable<User>;
  currentUser!: User;

  private currentUserSubj = new BehaviorSubject<User>(new User());

  private loadUserSubj = new Subject<void>();

  constructor(private userApiService: UserApiService, private toastService: ToastService) {
    this.currentUser$ = this.currentUserSubj.asObservable().pipe(share());

    this.loadUserSubj
      .asObservable()
      .pipe(
        switchMap(() => this.getCurrentUser()),
        catchError((error: HttpError) => {
          this.toastService.showHttpError(error);
          return EMPTY;
        })
      )
      .subscribe();
  }

  runUserLoad(): void {
    this.loadUserSubj.next();
  }

  getCurrentUser(): Observable<User> {
    return this.userApiService.getCurrentUser().pipe(
      tap(user => {
        this.currentUser = user;
        this.currentUserSubj.next(user);
      })
    );
  }

  getPendingUsers(offset = 0, limit = 1000) {
    return this.userApiService.getPendingUsers({ offset, limit });
  }

  resendUserActivation(userId: string) {
    return this.userApiService.resendUserActivation(userId);
  }
}
