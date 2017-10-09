import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { CallbackComponent } from './components/callback/callback.component';
import { FavoriteComponent } from './components/favorite/favorite.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { TitleCaseConverterComponent } from './components/title-case-convert/title-case-convert.component';
import { TitleCasePipe } from './pipes/title-case.pipe';
import { AuthGuardService } from './services/auth-guard/auth-guard.service';
import { AuthService } from './services/auth/auth.service';

@NgModule({
  declarations: [
    AppComponent,
    FavoriteComponent,
    TitleCaseConverterComponent,
    TitleCasePipe,
    LoginComponent,
    CallbackComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    RouterModule.forRoot([
      { path: 'home', component: HomeComponent },
      { path: 'login', component: LoginComponent },
      { path: 'callback', component: CallbackComponent },
      { path: 'favorites', component: FavoriteComponent, canActivate: [AuthGuardService] },
      { path: 'title-case-converter', component: TitleCaseConverterComponent },
      { path: '**', component: HomeComponent }
    ])
  ],
  providers: [
    AuthService,
    AuthGuardService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
