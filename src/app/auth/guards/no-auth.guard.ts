import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@services/data/auth.service';

@Injectable({ providedIn: 'root' })
export class NoAuthGuard  {
  constructor(private router: Router, private authService: AuthService) {}

  canActivate(): boolean | Promise<boolean> {
    if (!this.authService.isAuthenticated()) {
      return true;
    }

    return this.router.navigate(['/']).then(() => false);
  }
}
