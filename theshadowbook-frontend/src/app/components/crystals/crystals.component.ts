import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { BackendService } from 'src/app/services/backend.service';

@Component({
  selector: 'app-crystals',
  templateUrl: './crystals.component.html',
  styleUrls: ['./crystals.component.scss']
})
export class CrystalsComponent {
  crystals: any = [];
  isAdmin: boolean = false;
  isLoggedIn: boolean = false;
  user: any;
  userCrystals: any = [];
  grouped: boolean = true;

  constructor(
    private backendService: BackendService,
    private authService: AuthService,
    public router: Router
    ) {
  }

  ngOnInit() {
    this.backendService.getCrystals().subscribe(crystals => {
      this.crystals = crystals.crystals;

      this.backendService.getUser().subscribe(u => {
        this.user = u.user;
        this.grouped = this.user.groupedByDefault;

        this.backendService.getUserCrystals(this.user.id).subscribe(uc => {
          uc.crystals.map((i: { crystal: number; }) => {
            if (this.userCrystals[i.crystal] > 0) {
              this.userCrystals[i.crystal] = this.userCrystals[i.crystal] + 1;
            } else {
              this.userCrystals[i.crystal] = 1;
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
    this.backendService.addCrystalToCollection(id, this.user.id, status).subscribe(s => {
      if (this.userCrystals[id] > 0) {
        this.userCrystals[id] = this.userCrystals[id] + 1;
      } else {
        this.userCrystals[id] = 1;
      }
    });
  }

  getSubTypesofCrystal(id: number) {
    return this.crystals.filter((c: { parentCrystal: number; }) => c.parentCrystal === id);
  }

  toggleGrouped() {
    this.grouped = !this.grouped;
  }
}
