import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '@services/data/auth.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private authService: AuthService) {}

  canActivate(): boolean | Promise<boolean> {
    if (this.authService.isAuthenticated()) {
      return true;
    }

    // TODO: add user verification
    return this.router.navigate(['/auth/login']).then(() => false);
  }
}
