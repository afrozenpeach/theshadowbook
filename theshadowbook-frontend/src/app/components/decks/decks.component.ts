import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { BackendService } from 'src/app/services/backend.service';

@Component({
  selector: 'app-decks',
  templateUrl: './decks.component.html',
  styleUrls: ['./decks.component.scss']
})
export class DecksComponent {
  decks: any = [];
  isAdmin: boolean = false;
  isLoggedIn: boolean = false;
  user: any;
  userDecks: any = [];

  constructor(
    private backendService: BackendService,
    private authService: AuthService,
    public router: Router
    ) {
  }

  ngOnInit() {
    this.backendService.getDecks().subscribe(decks => {
      this.decks = decks.decks;

      this.backendService.getUser().subscribe(u => {
        this.user = u.user;

        this.backendService.getUserDecks(this.user.id).subscribe(ud => {
          ud.decks.map((i: { deck: number; }) => {
            if (this.userDecks[i.deck] > 0) {
              this.userDecks[i.deck] = this.userDecks[i.deck] + 1;
            } else {
              this.userDecks[i.deck] = 1;
            }
          });
        });
      });
    });

    this.authService.IsAdmin.subscribe(isAdmin => {
      this.isAdmin = isAdmin;
    });

    this.isLoggedIn = this.authService.isLoggedIn;
  }

  addToCollection(id: number, status: number) {
    this.backendService.addDeckToCollection(id, this.user.id, status).subscribe(s => {
      if (this.userDecks[id] > 0) {
        this.userDecks[id] = this.userDecks[id] + 1;
      } else {
        this.userDecks[id] = 1;
      }
    });
  }
}
