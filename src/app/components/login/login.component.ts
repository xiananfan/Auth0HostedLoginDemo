import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  invalidLogin: boolean;

  constructor(private router: Router, public auth: AuthService) { }

  ngOnInit() {
  }

  signIn(credentials) {
    this.auth.login(credentials);
  }

}
