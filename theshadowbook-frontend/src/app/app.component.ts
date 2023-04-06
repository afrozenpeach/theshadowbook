import { Component } from '@angular/core';

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
}
