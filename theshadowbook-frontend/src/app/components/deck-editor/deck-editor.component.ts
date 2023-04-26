import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { BackendService } from 'src/app/services/backend.service';

@Component({
  selector: 'app-deck-editor',
  templateUrl: './deck-editor.component.html',
  styleUrls: ['./deck-editor.component.scss']
})
export class DeckEditorComponent {
  id: String|null = '';

  deckTypes: any = [];

  deck: any = {};
  isAdmin: boolean = false;

  deckForm = new FormGroup({
    id: new FormControl(''),
    name: new FormControl('', Validators.required),
    type: new FormControl('', Validators.required),
    artist: new FormControl(''),
    author: new FormControl(''),
    publisher: new FormControl(''),
  })

  constructor(
    private backendService: BackendService,
    private route: ActivatedRoute,
    private authService: AuthService,
    public router: Router
  ) {

  }

  ngOnInit() {
    this.authService.IsAdmin.subscribe(isAdmin => {
      this.isAdmin = isAdmin;

      if (this.isAdmin) {
        this.backendService.getDeckTypes().subscribe((deckTypes: { deckTypes: any; }) => {
          this.deckTypes = deckTypes.deckTypes;

          this.route.paramMap.subscribe((params: ParamMap) => {
            this.id = params.get('id');

            if (this.id != null && this.id !== 'new') {
              this.backendService.getDeck(this.id).subscribe((deck: { deck: any; }) => {
                this.deck = deck.deck;

                this.deckForm.patchValue({
                  id: this.deck.id,
                  name: this.deck.name,
                  type: this.deck.type,
                  artist: this.deck.artist,
                  author: this.deck.author,
                  publisher: this.deck.publisher
                });
              });
            }
          });
        });
      } else {
        this.router.navigate(['/']);
      }
    })
  }

  save() {
    if (this.id === 'new') {
      this.backendService.createDeck(this.deckForm.value).subscribe((success: { success: any; error: { errors: { message: any; }[]; }; }) => {
        if (success.success) {
          this.router.navigate(['/decks/' + this.deckForm.controls['name'].value]);
        } else {
          alert(success.error.errors[0].message);
        }
      });
    } else {
      this.backendService.updateDeck(this.deckForm.value).subscribe((success: { success: any; error: { errors: { message: any; }[]; }; }) => {
        if (success.success) {
          this.router.navigate(['/decks/' + this.deckForm.controls['name'].value]);
        } else {
          alert(success.error.errors[0].message);
        }
      });
    }
  }
}
