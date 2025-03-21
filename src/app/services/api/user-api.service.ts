import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '@app/shared/models/user';
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
}
