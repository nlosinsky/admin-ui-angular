import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PendingUser, User } from '@app/shared/models/user';
import { environment } from '@env/environment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserApiService {
  private readonly basePath = environment.baseAdminUrl;

  constructor(private http: HttpClient) {}

  getCurrentUser(): Observable<User> {
    return this.http.get<User>(`${this.basePath}/users/current`).pipe(map(user => new User(user)));
  }

  getPendingUsers(params: { offset: number; limit: number }): Observable<PendingUser[]> {
    return this.http.get<PendingUser[]>(`${this.basePath}/users/pending`, { params }).pipe(
      map(users => {
        return users.map(user => new PendingUser(user)).sort((a, b) => a.username.localeCompare(b.username));
      })
    );
  }

  resendUserActivation(userId: string) {
    return this.http.post(`${this.basePath}/users/${userId}/resend-activation`, {});
  }
}
