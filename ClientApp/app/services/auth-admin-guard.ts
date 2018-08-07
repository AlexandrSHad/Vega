import { AuthGuard } from './auth-guard.service';
import { AuthService } from './auth.service';
import { Injectable } from '@angular/core';

@Injectable()
export class AuthAdminGuard extends AuthGuard {

  constructor(authService: AuthService) {
    super(authService);
  }

  canActivate() {
    var isAuthenticated = super.canActivate();

    return isAuthenticated ? this.authService.isInRole('Admin') : false;
  }

}
