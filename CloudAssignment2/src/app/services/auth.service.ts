import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase/app';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  authState = this.afAuth.authState;
  user = this.afAuth.user;

  constructor(private afAuth: AngularFireAuth) {}

  loginWithPopUp = () => this.afAuth.auth.signInWithPopup(new auth.GoogleAuthProvider());
  signOut = () => this.afAuth.auth.signOut();

}
