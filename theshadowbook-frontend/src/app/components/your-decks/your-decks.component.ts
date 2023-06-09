import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Observable, ReplaySubject, Subject, takeUntil, zip } from 'rxjs';
import { BackendService } from 'src/app/services/backend.service';

@Component({
  selector: 'app-your-decks',
  templateUrl: './your-decks.component.html',
  styleUrls: ['./your-decks.component.scss']
})
export class YourDecksComponent {

  user: any;
  decks: any = [];
  userDecks: any = [];
  statuses: any = [];

  deckForm: FormGroup[] = [];
  addDeckForm: FormGroup = new FormGroup({
    id: new FormControl('')
  });

  deckFilterCtrl: FormControl<any> = new FormControl<any>('');
  filteredDecks: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

  loading = true;

  _onDestroy = new Subject<void>();

  constructor(private backendService: BackendService) {

  }

  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

  ngOnInit() {
    this.deckFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterDecks();
      });

    this.backendService.getUser().subscribe(u => {
      this.user = u.user;

      this.backendService.getDecks().subscribe(d => {
        this.decks = d.decks;

        this.filteredDecks.next(this.decks.slice());

        this.backendService.getStatuses().subscribe(s => {
          this.statuses = s.statuses;

          this.backendService.getUserDecks(this.user.id).subscribe(ud => {
            this.userDecks = ud.decks;
            this.loading = false;

            for (let userDeck of this.userDecks) {
              this.deckForm[userDeck.id] = new FormGroup({
                id: new FormControl(userDeck.id),
                name: new FormControl(userDeck.name),
                status: new FormControl(userDeck.status),
                notes: new FormControl(userDeck.notes)
              });
            }
          });
        });
      });
    });
  }

  getUserDecksOfType(id: number) {
    return this.userDecks.filter((ud: {deck: number;}) => ud.deck === id);
  }

  saveUserDeck(id: number) {
    this.backendService.saveUserDeck(this.deckForm[id].value).subscribe(s => {

    });
  }

  deleteUserDeck(id: number) {
    if (confirm('Are you sure you want to delete this deck?')) {
      this.backendService.deleteUserDeck(id).subscribe((s: any) => {
        this.userDecks = this.userDecks.filter((ud: { id: number; }) => ud.id != id);
      });
    }
  }

  saveDisabled(id: number) {
    return !this.deckForm[id].valid;
  }

  addUserDeck(status: number) {
    if (this.addDeckForm.controls['id'].value) {
      this.backendService.addDeckToCollection(this.addDeckForm.controls['id'].value, this.user.id, status).subscribe(s => {
        this.deckForm[s.deck.id] = new FormGroup({
          id: new FormControl(s.deck.id),
          name: new FormControl(''),
          status: new FormControl(s.deck.status),
          notes: new FormControl('')
        });

        this.userDecks.push(s.deck);
      });
    } else {
      alert('Select a deck using the dropdown first.');
    }
  }

  saveAllUserDecks() {
    this.loading = true;
    let subscriptions: Observable<any>[] = [];

    this.userDecks.map((ud: { id: number; }) => {
      subscriptions.push(this.backendService.saveUserDeck(this.deckForm[ud.id].value));
    });

    zip(...subscriptions).subscribe(() => {
      this.loading = false;
    });
  }

  protected filterDecks() {
    if (!this.decks) {
      return;
    }
    // get the search keyword
    let search = this.deckFilterCtrl.value;
    if (!search) {
      this.filteredDecks.next(this.decks.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the decks
    this.filteredDecks.next(
      this.decks.filter((d: { name: string; }) => d.name.toLowerCase().indexOf(search) > -1)
    );
  }
}
