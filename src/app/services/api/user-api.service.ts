import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { User } from '@app/shared/models/user';
import { environment } from '@env/environment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserApiService {
  private http = inject(HttpClient);

  private readonly basePath = environment.apiUrl;

  getCurrentUser(): Observable<User> {
    return this.http.get<User>(`${this.basePath}/users/current`).pipe(map(user => new User(user)));
  }
}
