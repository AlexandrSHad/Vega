import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import * as auth0 from 'auth0-js';
import 'rxjs/add/operator/filter'

(window as any).global = window;

@Injectable()
export class AuthService {

  auth0 = new auth0.WebAuth({
    clientID: 'JRTQlnumNsSg6nsy1DfVEYle65uY9gVw',
    domain: 'shad-vega.eu.auth0.com',
    responseType: 'token id_token',
    audience: 'https://api.shad.vega.com',
    redirectUri: 'http://localhost:5000',
    scope: 'openid email profile',
  });

  profile: any;

  constructor(public router: Router) {
    var profileString = localStorage.getItem('profile');

    if (profileString)
      this.profile = JSON.parse(profileString);
  }

  public login(): void {
    this.auth0.authorize();
  }

  public handleAuthentication(): void {
    this.auth0.parseHash((err, authResult) => {
      if (authResult && authResult.accessToken && authResult.idToken) {
        window.location.hash = '';
        this.setSession(authResult);
        this.router.navigate(['/vehicles']);

        this.auth0.client.userInfo(authResult.accessToken, (error, profile) => {
          if (error)
            throw error;

          localStorage.setItem('profile', JSON.stringify(profile));
          this.profile = profile;
        });

      } else if (err) {
        this.router.navigate(['/vehicles']);
        console.log(err);
      }
    });
  }

  private setSession(authResult: any): void {
    // Set the time that the Access Token will expire at
    const expiresAt = JSON.stringify((authResult.expiresIn * 1000) + new Date().getTime());
    localStorage.setItem('access_token', authResult.accessToken);
    localStorage.setItem('id_token', authResult.idToken);
    localStorage.setItem('expires_at', expiresAt);
  }

  public logout(): void {
    // Remove tokens and expiry time from localStorage
    localStorage.removeItem('access_token');
    localStorage.removeItem('id_token');
    localStorage.removeItem('expires_at');
    localStorage.removeItem('profile');
    // Clear local variables
    this.profile = null;
    // Go back to the home route
    this.router.navigate(['/vehicles']);
  }

  public isAuthenticated(): boolean {
    const expiresAt = JSON.parse(localStorage.getItem('expires_at') || '{}');
    return new Date().getTime() < expiresAt;
  }

}