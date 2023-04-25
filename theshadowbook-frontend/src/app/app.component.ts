import { Component } from '@angular/core';
import { AuthService } from './services/auth.service';

const firebaseConfig = {
    apiKey: "AIzaSyDUg37YOEpKUbx39MZ-Q5lvXRwjuG5PXyY",
    authDomain: "the-shadow-book.firebaseapp.com"
};

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'The Shadow Book';
  loggedIn: boolean|null = null;

  constructor(private authService: AuthService) {
    this.authService.afAuth.authState.subscribe(u => {
      if (u) {
        this.loggedIn = true;
      } else {
        this.loggedIn = false;
      }
    });
  }

}
