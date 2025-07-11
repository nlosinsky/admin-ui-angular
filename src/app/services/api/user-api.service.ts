import { httpResource } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '@app/shared/models/user';
import { environment } from '@env/environment';

@Injectable({
  providedIn: 'root'
})
export class UserApiService {
  private readonly basePath = environment.apiUrl;

  getCurrentUser() {
    return httpResource(() => `${this.basePath}/users/current`, {
      parse: (value: unknown) => new User(value)
    });
  }
}
