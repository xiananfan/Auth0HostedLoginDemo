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

  public login(): void {
    const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') || '/';
    localStorage.setItem('returnUrl', returnUrl);

    // -------- Redirect to hosted login
    // this.auth0.authorize();

    // -------- Redirect in Pop-up (also to hosted login)
    // this needs at least one option, so it doesn't error out on 'convert null to object'
    // this needs to work with the callback component, it needs to call webauth.popup.callback() to invoke the
    // callback function passed in as the 2nd parameter here.
    // this.auth0.popup.authorize({
    //   redirectUri: 'http://localhost:4200/callback'
    // }, (err, authResult) => {
    //   if (err) {
    //     this.router.navigate(['/home']);
    //     console.log(err);
    //   } else {
    //     this.setSession(authResult);
    //     this.router.navigateByUrl(returnUrl);
    //   }
    // });

    // -------- Redirect login with credential
    // currently not working, will encounter "Password login is disabled for clients using externally hosted login
    // pages with oidc_conformant flag set."
    // this.auth0.redirect.loginWithCredentials({
    //   connection: 'Username-Password-Authentication',
    //   username: 'xianan.fan',
    //   password: '123456'
    // }, (err, authResult) => {
    //   if (err) {
    //     this.router.navigate(['/home']);
    //     console.log(err);
    //   } else {
    //     this.setSession(authResult);
    //     this.router.navigateByUrl(returnUrl);
    //   }
    // });

    // -------- pop-up login with credentials
    // currently not working, will encounter "Password login is disabled for clients using externally hosted login
    // pages with oidc_conformant flag set."
    // this.auth0.popup.loginWithCredentials({
    //   connection: 'Username-Password-Authentication',
    //   username: 'xianan.fan',
    //   password: '123456',
    //   scope: 'openid profile'
    // }, (err, authResult) => {
    //   if (err) {
    //     this.router.navigate(['/home']);
    //     console.log(err);
    //   } else {
    //     this.setSession(authResult);
    //     this.router.navigateByUrl(returnUrl);
    //   }
    // });

    // -------- Authenticate with API, requires custom UI
    // Works. One issue: all scopes defined on the API in Auth0 is returned.
    this.auth0.client.login({
      realm: 'Username-Password-Authentication',
      username: 'xianan.fan',
      password: '123456',
      // scope: 'openid profile',
      // audience: 'https://dev.api.teradatacloud.io/'
    }, (err, authResult) => {
      if (err) {
        this.router.navigate(['/home']);
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
