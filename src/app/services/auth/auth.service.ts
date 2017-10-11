import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import 'rxjs/add/operator/filter';
import * as auth0 from 'auth0-js';

@Injectable()
export class AuthService {

  auth0 = new auth0.WebAuth({
    clientID: 'BT57J15EHFqB516RYiMqU73l956RU6rU',
    domain: 'trianglebamboo.auth0.com',
    responseType: 'token id_token',
    audience: 'https://dev.api.teradatacloud.io/',
    redirectUri: 'http://localhost:4200/callback',
    scope: 'openid profile',
    leeway: 30
  });

  constructor(private router: Router, private route: ActivatedRoute) {}

  public login(credential: any): void {
    const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') || '/';
    localStorage.setItem('returnUrl', returnUrl);

    console.log('username', credential.username);
    console.log('password', credential.password);

    // -------- Authenticate with API, requires custom UI
    // Works. One issue: all scopes defined on the API in Auth0 is returned.
    this.auth0.client.login({
      realm: 'Username-Password-Authentication',
      username: credential.username,
      password: credential.password,
      // scope: 'openid profile',
      // audience: 'https://dev.api.teradatacloud.io/'
    }, (err, authResult) => {
      if (err) {
        // this.router.navigate(['/login']);
        alert('Failed to login: ' + err.message);
        console.log(err);
      } else {
        this.setSession(authResult);
        this.router.navigateByUrl(returnUrl);
      }
    });
  }

  public handleAuthentication(): void {
    // this.auth0.parseHash((err, authResult) => {
    //   if (authResult && authResult.accessToken && authResult.idToken) {
    //     window.location.hash = '';
    //     this.setSession(authResult);
    //     const returnUrl = localStorage.getItem('returnUrl');
    //     this.router.navigateByUrl(returnUrl);
    //   } else if (err) {
    //     this.router.navigate(['/home']);
    //     console.log(err);
    //   }
    // });
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
    this.router.navigate(['/']);
  }

  public isAuthenticated(): boolean {
    // Check whether the current time is past the
    // access token's expiry time
    const expiresAt = JSON.parse(localStorage.getItem('expires_at'));
    return new Date().getTime() < expiresAt;
  }

}
