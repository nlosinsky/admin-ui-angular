import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PendingUser, User } from '@app/shared/models/user';
import { environment } from '@env/environment';
import { EMPTY, Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserApiService {
  private readonly basePath = environment.baseAdminUrl;

  constructor(private http: HttpClient) {}

  //  todo
  getCurrentUser(): Observable<User> {
    return this.http.get<User>(`${this.basePath}/users/current`).pipe(
      map(user => new User(user)),
    //   todo remove this
      catchError(() => {
        return EMPTY;
      })
    );
  }

  //  todo
  getPendingUsers(limit = 1000, offset = 0): Observable<PendingUser[]> {
    return this.http.get<PendingUser[]>(`${this.basePath}/users/pending`, {
      params: {
        _limit: limit.toString(),
        _start: offset.toString()
      }
    }).pipe(
      map(users => {
        return users.map(user => new PendingUser(user)).sort((a, b) => a.username.localeCompare(b.username));
      })
    );
  }

  //  todo
  resendUserActivation(userId: string) {
    return this.http.post(`${this.basePath}/users/${userId}/resend-activation`, {});
  }
}
