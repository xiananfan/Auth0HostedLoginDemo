import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-callback',
  templateUrl: './callback.component.html',
  styleUrls: ['./callback.component.css']
})
export class CallbackComponent implements OnInit {

  constructor(public auth: AuthService) { }

  ngOnInit() {
    console.log('callback component on init.');
    if (this.auth.isAuthenticated()) {
      console.log('token is set in localstorage');
    } else {
      console.log('auth service hasn\'t store the token info in localstorage');
    }
  }

}
