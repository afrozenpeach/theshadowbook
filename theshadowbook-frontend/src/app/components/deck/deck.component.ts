import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { BackendService } from 'src/app/services/backend.service';

@Component({
  selector: 'app-deck',
  templateUrl: './deck.component.html',
  styleUrls: ['./deck.component.scss']
})
export class DeckComponent {
  name: String|undefined = '';

  deckTypes: any = [];

  deck: any = {};
  isAdmin: boolean = false;

  constructor(
    private backendService: BackendService,
    private route: ActivatedRoute,
    private authService: AuthService,
    public router: Router
  ) {

  }

  ngOnInit() {
    this.backendService.getDeckTypes().subscribe(deckTypes => {
      this.deckTypes = deckTypes.deckTypes;

      this.route.paramMap.subscribe((params: ParamMap) => {
        this.name = params.get('name')?.replace('-', ' ');

        if (this.name != null) {
          this.backendService.getDeck(this.name).subscribe((deck) => {
            this.deck = deck.deck;
          });
        }
      });
    });

    this.authService.IsAdmin.subscribe(isAdmin => {
      this.isAdmin = isAdmin;
    })
  }

  getDeckTypeName(id: any) {
    return this.deckTypes.filter((f: { id: any; }) => f.id === id)[0].type;
  }
}
