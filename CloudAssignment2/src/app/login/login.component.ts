import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { auth } from 'firebase/app';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  authState = this.authService.authState;

  errorMessage: string;

  constructor(private authService: AuthService) { }

  ngOnInit() {
  }

  tryLogin() {
    this.authService.loginWithPopUp()
      .then( res => {
        this.errorMessage = '';
      }, err => {
        this.errorMessage = err.message;
      });
  }

  signOut() {
    this.authService.signOut()
      .then( () => {
        this.errorMessage = '';
      });
  }
}
