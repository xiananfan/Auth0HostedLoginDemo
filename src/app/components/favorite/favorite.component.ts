import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'favorite',
  templateUrl: './favorite.component.html',
  styleUrls: ['./favorite.component.css']
})
export class FavoriteComponent implements OnInit {

  isFavorite: boolean;

  constructor(private authService: AuthService) {
    this.isFavorite = false;
  }

  onClick() {
    this.isFavorite = !this.isFavorite;
  }

  ngOnInit() {
  }

}
