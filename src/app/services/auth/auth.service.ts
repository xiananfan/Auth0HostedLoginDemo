import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { WebAuth } from 'auth0-js';
import 'rxjs/add/operator/filter';

@Injectable()
export class AuthService {

  auth0: WebAuth;

  constructor(private router: Router, private route: ActivatedRoute) {
    this.auth0 = new WebAuth({
      clientID: 'BT57J15EHFqB516RYiMqU73l956RU6rU',
      domain: 'trianglebamboo.auth0.com',
      responseType: 'token id_token',
      audience: 'https://dev.api.teradatacloud.io/',
      redirectUri: 'https://localhost:4200/callback',
      scope: 'openid profile',
      leeway: 30
    });
  }

  public login(credential: any): void {
    const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') || '/';
    localStorage.setItem('returnUrl', returnUrl);

    console.log('username', credential.username);
    console.log('password', credential.password);

    // ------- Cross-origin authentication is not currently supported on our version of appliance
    this.auth0.login({
      // realm: 'AD-DEV',
      username: credential.username,
      password: credential.password
    }, (err) => {
      if (err) {
        console.log('failed to complete cross-origin authentication:', err.message);
      }
    });

  }

  public handleAuthentication(): void {
    this.auth0.parseHash((err, authResult) => {
      if (authResult && authResult.accessToken && authResult.idToken) {
        window.location.hash = '';
        this.setSession(authResult);
        const returnUrl = localStorage.getItem('returnUrl');
        console.log('navigate to ', returnUrl);
        this.router.navigateByUrl('/home');
      } else if (err) {
        this.router.navigate(['/home']);
        console.log(err);
      }
    });
  }

  private setSession(authResult): void {
    // Set the time that the access token will expire at
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
    // Go back to the home route
    // this.router.navigate(['/']);
    this.auth0.logout({
      returnTo: 'https://localhost:4200/home',
      clientID: 'BT57J15EHFqB516RYiMqU73l956RU6rU'
    });
  }

  public isAuthenticated(): boolean {
    // Check whether the current time is past the
    // access token's expiry time
    const expiresAt = JSON.parse(localStorage.getItem('expires_at'));
    return new Date().getTime() < expiresAt;
  }

  public getSSOData(): void {
    this.auth0.client.getSSOData(true, (err, ssoData) => {
      if (err) {
        console.log('Encountered an error:', err.message);
      } else {
        console.log(ssoData);
      }
    });
  }

}
