import { inject, Injectable } from '@angular/core';
import { UserApiService } from '@services/api/user-api.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private userApiService = inject(UserApiService);

  getCurrentUser() {
    return this.userApiService.getCurrentUser();
  }
}
