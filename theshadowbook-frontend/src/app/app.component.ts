import { Component } from '@angular/core';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { faDiscord } from '@fortawesome/free-brands-svg-icons';
import { faGem, faLayerGroup, faHatWizard, faBook } from '@fortawesome/free-solid-svg-icons';
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
  date: Date = new Date();
  launchYear: number = 2023;
  year: number = this.date.getFullYear();

  faDiscord: IconDefinition = faDiscord;
  faGem: IconDefinition = faGem;
  faLayerGroup: IconDefinition = faLayerGroup;
  faHatWizard: IconDefinition = faHatWizard;
  faBook: IconDefinition = faBook;

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
