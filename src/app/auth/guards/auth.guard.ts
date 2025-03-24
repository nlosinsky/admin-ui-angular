import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@services/data/auth.service';

// todo check in documentation how to declare guards
@Injectable({ providedIn: 'root' })
export class AuthGuard  {
  constructor(private router: Router, private authService: AuthService) {}

  canActivate(): boolean | Promise<boolean> {
    if (this.authService.isAuthenticated()) {
      return true;
    }

    return this.router.navigate(['/auth/login']).then(() => false);
  }
}
