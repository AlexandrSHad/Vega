import { AuthService } from './auth.service';
import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(protected authService: AuthService) { }

  canActivate() {
    if (this.authService.isAuthenticated())
      return true;

    this.authService.login();
    return false;
  }

}
