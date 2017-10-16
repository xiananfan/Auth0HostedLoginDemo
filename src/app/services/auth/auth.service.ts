import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import 'rxjs/add/operator/filter';
import { WebAuth } from 'auth0-js';
import Auth0Lock from 'auth0-lock';

@Injectable()
export class AuthService {

  auth0: WebAuth;
  lock: Auth0Lock;

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

    this.lock = new Auth0Lock('BT57J15EHFqB516RYiMqU73l956RU6rU', 'trianglebamboo.auth0.com',
    // this.lock = new Auth0Lock('QrpZYg7U44NyypQFapK26Rpmk2Y5xBZD', 'sso.teradatacloud.io',
      {
        allowedConnections: ['Username-Password-Authentication'],
        // allowedConnections: ['AD-DEV'],
        auth: {
          audience: 'https://dev.api.teradatacloud.io/',
          params: {
            scope: 'openid profile',
            // state: 'my-custom-state',
            // nonce: '12345'
          },
          redirect: true,
          redirectUrl: 'https://localhost:4200/callback',
          // responseMode: 'form_post',
          responseType: 'token id_token',
          sso: true,
        },
        allowSignUp: false,
        // defaultDatabaseConnection: 'Username-Password-Authentication',
        oidcConformant: true,
        hashCleanup: true,
        leeway: 30
      }
    );

    this.lock.on('authenticated', (authResult) => {
      console.log(authResult);
      if (authResult && authResult.accessToken && authResult.idToken) {
        // window.location.hash = '';
        this.setSession(authResult);
        const returnUrl = localStorage.getItem('returnUrl');
        // this.router.navigateByUrl(returnUrl);
      } else {
        // this.router.navigate(['/home']);
        console.log('authResult doesn\'t contain accessToken and idToken');
      }
    });
  }

  public login(): void {
    const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') || '/';
    localStorage.setItem('returnUrl', returnUrl);

    // console.log('username', credential.username);
    // console.log('password', credential.password);

    // -------- Authenticate with API, requires custom UI
    // Works. One issue: all scopes defined on the API in Auth0 is returned.
    // this.auth0.client.login({
    //   realm: 'AD-DEV',
    //   username: credential.username,
    //   password: credential.password,
    //   // scope: 'openid profile',
    //   // audience: 'https://dev.api.teradatacloud.io/'
    // }, (err, authResult) => {
    //   if (err) {
    //     // this.router.navigate(['/login']);
    //     alert('Failed to login: ' + err.message);
    //     console.log(err);
    //   } else {
    //     this.setSession(authResult);
    //     this.router.navigateByUrl(returnUrl);
    //   }
    // });

    // ------- Cross-origin authentication is not currently supported on our version of appliance
    // this.auth0.login({
    //   // realm: 'AD-DEV',
    //   username: credential.username,
    //   password: credential.password
    // }, (err) => {
    //   if (err) {
    //     console.log('encounter an error', err.message);
    //   }
    // });

    this.lock.show();
  }

  public handleAuthentication(): void {
    this.auth0.parseHash((err, authResult) => {
      if (authResult && authResult.accessToken && authResult.idToken) {
        window.location.hash = '';
        this.setSession(authResult);
        const returnUrl = localStorage.getItem('returnUrl');
        this.router.navigateByUrl(returnUrl);
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
