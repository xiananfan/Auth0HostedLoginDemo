import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-callback',
  templateUrl: './callback.component.html',
  styleUrls: ['./callback.component.css']
})
export class CallbackComponent implements OnInit {

  constructor(private auth: AuthService) {
    this.auth.handleAuthentication();
  }

  ngOnInit() {
    console.log(window.location.hash);
  }

}
