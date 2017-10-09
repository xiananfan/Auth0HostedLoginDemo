import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { AuthorsComponent } from './components/authors/authors.component';
import { FavoriteComponent } from './components/favorite/favorite.component';
import { TitleCaseConverterComponent } from './components/title-case-convert/title-case-convert.component';
import { TitleCasePipe } from './pipes/title-case.pipe';
import { AuthService } from './services/auth/auth.service';
import { AuthorsService } from './services/authors/authors.service';
import { RouterModule } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { CallbackComponent } from './components/callback/callback.component';
import { HomeComponent } from './components/home/home.component';
import { AuthGuardService } from './services/auth-guard/auth-guard.service';

@NgModule({
  declarations: [
    AppComponent,
    AuthorsComponent,
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
      { path: 'authors', component: AuthorsComponent },
      { path: 'favorites', component: FavoriteComponent, canActivate: [AuthGuardService] },
      { path: 'title-case-converter', component: TitleCaseConverterComponent },
      { path: '**', component: HomeComponent }
    ])
  ],
  providers: [
    AuthorsService,
    AuthService,
    AuthGuardService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
