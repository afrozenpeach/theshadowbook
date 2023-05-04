import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { BackendService } from 'src/app/services/backend.service';
import { faShareNodes } from '@fortawesome/free-solid-svg-icons';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent {
  user: any = null;
  userLoggedIn: any = null;
  crystals: any = [];
  userCrystals: any = [];
  userCrystalsOfType: any = [];
  decks: any = [];
  userDecks: any = [];

  chakras: any = [];
  colors: any = [];
  domains: any = [];
  elements: any = [];
  moonPhases: any = [];
  zodiacs: any = [];
  shapes: any = [];
  statuses: any = [];

  grouped: boolean = true;
  loading: boolean = true;

  crystalToggle: boolean = true;
  deckToggle: boolean = true;

  faShareNodes: IconDefinition = faShareNodes;

 constructor(
  private backendService: BackendService,
  private route: ActivatedRoute,
  private router: Router,
  private snackBar: MatSnackBar
  ) {

 }

 ngOnInit() {
  this.loading = true;

  this.backendService.getUser().subscribe(ul => {
    this.userLoggedIn = ul?.user;

    this.grouped = this.userLoggedIn !== undefined ? this.userLoggedIn.groupedByDefault : true;

    this.backendService.getChakras().subscribe(c => {
      this.chakras = c.chakras;

      this.backendService.getColors().subscribe(co => {
        this.colors = co.colors;

        this.backendService.getDomains().subscribe(d => {
          this.domains = d.domains;

          this.backendService.getElements().subscribe(e => {
            this.elements = e.elements;

            this.backendService.getMoonPhases().subscribe(m => {
              this.moonPhases = m.moonPhases;

              this.backendService.getZodiacs().subscribe(z => {
                this.zodiacs = z.zodiacs;

                this.backendService.getShapes().subscribe(s => {
                  this.shapes = s.shapes;

                  this.backendService.getStatuses().subscribe(st => {
                    this.statuses = st.statuses;

                    this.backendService.getCrystals().subscribe(cr => {
                      this.crystals = cr.crystals;

                      this.backendService.getDecks().subscribe(de => {
                        this.decks = de.decks;

                        this.route.paramMap.subscribe(params => {
                          let name = params.get('name');

                          if (name !== null) {
                            this.backendService.getProfile(name).subscribe(u => {
                              this.user = u.user;

                              if (this.user?.isPublic || (this.userLoggedIn !== null && this.userLoggedIn?.id === this.user.id)) {
                                this.backendService.getUserCrystals(this.user.id).subscribe(uc => {
                                  this.userCrystals = uc.crystals;

                                  this.buildUserCrystals();

                                  this.backendService.getUserDecks(this.user.id).subscribe(ud => {
                                    this.userDecks = ud.decks;

                                    this.loading = false;
                                  });
                                })
                              } else {
                                this.router.navigate(['404']);
                              }
                            },
                            (error) => {
                              this.router.navigate(['404']);
                            });
                          } else {
                            this.router.navigate(['404']);
                          }
                        });
                      });
                    });
                  });
                });
              });
            });
          });
        });
      });
    });
  });
 }

 getZodiacName(id: number) {
  return this.zodiacs.filter((z: { id: number; }) => z.id === id)[0].sign;
 }

 addUserCrystalOfType(userCrystal: any) {
   let crystal = this.crystals.filter((c: { id: any; }) => c.id === userCrystal.crystal)[0];
   let parentCrystal = crystal.parentCrystal ? this.crystals.filter((c: { id: any; }) => c.id === crystal.parentCrystal)[0].id : 0;
   let parentParentCrystal = parentCrystal?.parentCrystal ? this.crystals.filter((c: { id: any; }) => c.id === parentCrystal.parentCrystal)[0].id : 0;
   let parentParentParentCrystal = parentParentCrystal?.parentCrystal ? this.crystals.filter((c: { id: any; }) => c.id === parentParentCrystal.parentCrystal)[0].id : 0;

   if (parentParentParentCrystal) {
     if (this.userCrystalsOfType[parentParentParentCrystal] === undefined) {
       this.userCrystalsOfType[parentParentParentCrystal] = {
         crystals: [],
         children: []
       };
     }

     if (this.userCrystalsOfType[parentParentParentCrystal].children[parentParentCrystal] === undefined) {
       this.userCrystalsOfType[parentParentParentCrystal].children[parentParentCrystal] = {
         crystals: [],
         children: []
       };
     }

     if (this.userCrystalsOfType[parentParentParentCrystal].children[parentParentCrystal].children[parentCrystal] === undefined) {
       this.userCrystalsOfType[parentParentParentCrystal].children[parentParentCrystal].children[parentCrystal] = {
         crystals: [],
         children: []
       };
     }

     if (this.userCrystalsOfType[parentParentParentCrystal].children[parentParentCrystal].children[parentCrystal].children[crystal.id] === undefined) {
       this.userCrystalsOfType[parentParentParentCrystal].children[parentParentCrystal].children[parentCrystal].children[crystal.id] = {
         crystals: [],
         children: []
       };
     }

     this.userCrystalsOfType[parentParentParentCrystal].children[parentParentCrystal].children[parentCrystal].children[crystal.id].crystals.push(userCrystal);
   } else if (parentParentCrystal) {
     if (this.userCrystalsOfType[parentParentCrystal] === undefined) {
       this.userCrystalsOfType[parentParentCrystal] = {
         crystals: [],
         children: []
       };
     }

     if (this.userCrystalsOfType[parentParentCrystal].children[parentCrystal] === undefined) {
       this.userCrystalsOfType[parentParentCrystal].children[parentCrystal] = {
         crystals: [],
         children: []
       };
     }

     if (this.userCrystalsOfType[parentParentCrystal].children[parentCrystal].children[crystal.id] === undefined) {
       this.userCrystalsOfType[parentParentCrystal].children[parentCrystal].children[crystal.id] = {
         crystals: [],
         children: []
       };
     }

     this.userCrystalsOfType[parentParentCrystal].children[parentCrystal].children[crystal.id].crystals.push(userCrystal);
   } else if (parentCrystal) {
     if (this.userCrystalsOfType[parentCrystal] === undefined) {
       this.userCrystalsOfType[parentCrystal] = {
         crystals: [],
         children: []
       };
     }

     if (this.userCrystalsOfType[parentCrystal].children[crystal.id] === undefined) {
       this.userCrystalsOfType[parentCrystal].children[crystal.id] = {
         crystals: [],
         children: []
       };
     }

     this.userCrystalsOfType[parentCrystal].children[crystal.id].crystals.push(userCrystal);
   } else {
     if (this.userCrystalsOfType[crystal.id] === undefined) {
       this.userCrystalsOfType[crystal.id] = {
         crystals: [],
         children: []
       };
     }

     this.userCrystalsOfType[crystal.id].crystals.push(userCrystal);
   }
 }

 getCrystals() {
  if (this.grouped) {
    return this.crystals.filter((c: { parentCrystal: number|null; }) => c.parentCrystal === null);
  } else {
    return this.crystals;
  }
 }

 getShapeName(id: number) {
  return this.shapes.filter((s: { id: number; }) => s.id === id)[0].shape;
 }

 getColorName(id: number) {
  return this.colors.filter((c: { id: number; }) => c.id === id)[0].color;
 }

 getStatusName(id: number) {
  return this.statuses.filter((s: { id: number; }) => s.id === id)[0].status;
 }

 getCrystal(id: number) {
  return this.crystals.filter((c: { id: number; }) => c.id === id)[0];
 }

 getSubTypesOfCrystal(id: number) {
   let returnValue = this.crystals.filter((s: { parentCrystal: number; }) => s.parentCrystal === id);
   returnValue.unshift({id: 0, crystal: id, type: ''});
   return returnValue;
 }

 getDeckName(id: number) {
  return this.decks.filter((d: { id: number; }) => d.id === id)[0].name;
 }

 getTypesOfDeck(id: number) {
  let returnValue = this.userDecks.filter((d: { id: number; }) => d.id === id);
  return returnValue;
 }

 toggleGrouped() {
   if (!this.loading) {
     this.loading = true;
     this.grouped = !this.grouped;

     this.buildUserCrystals();

     this.loading = false;
   }
 }

 buildUserCrystals() {
   this.userCrystalsOfType = [];

   if (this.grouped) {
     for (let uc of this.userCrystals) {
       this.addUserCrystalOfType(uc);
     }
   } else {
     for (let uc of this.userCrystals) {
       if (this.userCrystalsOfType[uc.crystal] === undefined) {
         this.userCrystalsOfType[uc.crystal] = {
           crystals: [],
           children: []
         };
       }

       this.userCrystalsOfType[uc.crystal].crystals.push(uc);
     }
   }
 }

 toggleCrystals() {
   this.crystalToggle = !this.crystalToggle;
   return this.crystalToggle;
 }

 toggleDecks() {
   this.deckToggle = !this.deckToggle;
   return this.deckToggle;
 }

  share() {
    navigator.clipboard.writeText('https://theshadowbook.com/profile/' + this.user.name)
    this.snackBar.open('Copied profile link to clipboard', 'close', {
      duration: 5000
    })
  }
}
