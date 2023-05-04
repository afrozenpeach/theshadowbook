import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { faArrowUpFromBracket, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { Observable, ReplaySubject, Subject, takeUntil, zip } from 'rxjs';
import { BackendService } from 'src/app/services/backend.service';

@Component({
  selector: 'app-your-crystals',
  templateUrl: './your-crystals.component.html',
  styleUrls: ['./your-crystals.component.scss']
})
export class YourCrystalsComponent {

  user: any;
  crystals: any = [];
  userCrystals: any = [];
  colors: any = [];
  statuses: any = [];
  shapes: any = [];
  chakras: any = [];
  cleansings: any = [];
  domains: any = [];
  elements: any = [];
  moonPhases: any = [];
  zodiacs: any = [];

  crystalForms: FormGroup[] = [];
  addCrystalForm: FormGroup = new FormGroup({
    crystal: new FormControl('')
  });

  filterForm: FormGroup = new FormGroup({
    chakras: new FormControl([]),
    cleansings: new FormControl([]),
    domains: new FormControl([]),
    elements: new FormControl([]),
    moonPhases: new FormControl([]),
    zodiacs: new FormControl([]),
    shapes: new FormControl([]),
    statuses: new FormControl([]),
    colors: new FormControl([])
  });

  crystalFilterCtrl: FormControl<any> = new FormControl<any>('');
  filteredCrystals: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

  userCrystalsOfType: any = [];

  grouped = true;
  loading = true;

  faArrowUp: IconDefinition = faArrowUpFromBracket;

  protected _onDestroy = new Subject<void>();

  constructor(private backendService: BackendService) {

  }

  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

  ngOnInit() {
    this.crystalFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterCrystals();
      });

    this.backendService.getColors().subscribe(c => {
      this.colors = c.colors;

      this.backendService.getStatuses().subscribe(s => {
        this.statuses = s.statuses;

        this.backendService.getShapes().subscribe(s => {
          this.shapes = s.shapes;

          this.backendService.getChakras().subscribe(cc => {
            this.chakras = cc.chakras;

            this.backendService.getCleansings().subscribe(cl => {
              this.cleansings = cl.cleansings;

              this.backendService.getDomains().subscribe(d => {
                this.domains = d.domains;

                this.backendService.getElements().subscribe(e => {
                  this.elements = e.elements;

                  this.backendService.getMoonPhases().subscribe(mp => {
                    this.moonPhases = mp.moonPhases;

                    this.backendService.getZodiacs().subscribe(z => {
                      this.zodiacs = z.zodiacs;

                      this.clearFilters();

                      this.backendService.getUser().subscribe(u => {
                        this.user = u.user;

                        this.grouped = this.user.groupedByDefault;

                        this.backendService.getCrystals().subscribe(c => {
                          this.crystals = c.crystals;

                          this.filteredCrystals.next(this.crystals.slice());

                          this.backendService.getUserCrystals(this.user.id).subscribe(uc => {
                            this.userCrystals = uc.crystals;

                            for (let userCrystal of this.userCrystals) {
                              this.crystalForms[userCrystal.id] = new FormGroup({
                                id: new FormControl(userCrystal.id),
                                name: new FormControl(userCrystal.name),
                                primaryColor: new FormControl(userCrystal.primaryColor),
                                secondaryColor: new FormControl(userCrystal.secondaryColor),
                                tertiaryColor: new FormControl(userCrystal.tertiaryColor),
                                sizeX: new FormControl(userCrystal.sizeX),
                                sizeY: new FormControl(userCrystal.sizeY),
                                sizeZ: new FormControl(userCrystal.sizeZ),
                                weight: new FormControl(userCrystal.weight),
                                karat: new FormControl(userCrystal.karat),
                                cut: new FormControl(userCrystal.cut),
                                aura: new FormControl(userCrystal.aura),
                                status: new FormControl(userCrystal.status),
                                shape: new FormControl(userCrystal.shape),
                                notes: new FormControl(userCrystal.notes),
                              });
                            }

                            this.buildUserCrystals();

                            this.loading = false;
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

  getCrystals() {
    if (this.grouped) {
      return this.crystals.filter((c: { parentCrystal: number|null; }) => c.parentCrystal === null);
    } else {
      return this.crystals;
    }
  }

  getCrystal(id: number) {
    return this.crystals.filter((c: { id: number; }) => c.id === id)[0];
  }

  getUserCrystalsOfType(id: number) {
    return this.userCrystals.filter((uc: {crystal: number;}) => uc.crystal === id);
  }

  getSubTypesOfCrystal(id: number) {
    let returnValue = this.crystals.filter((s: { parentCrystal: number; }) => s.parentCrystal === id);
    returnValue.unshift({id: 0, crystal: id, type: ''});
    return returnValue;
  }

  saveUserCrystal(id: number) {
    this.backendService.saveUserCrystal(this.crystalForms[id].value).subscribe(s => {

    });
  }

  deleteUserCrystal(id: number) {
    if (confirm('Are you sure you want to delete this crystal?')) {
      let userCrystal = this.userCrystals.filter((uc: { id: number; }) => uc.id === id)[0];

      let crystal = this.crystals.filter((c: { id: any; }) => c.id === userCrystal.crystal)[0];
      let parentCrystal = crystal.parentCrystal ? this.crystals.filter((c: { id: any; }) => c.id === crystal.parentCrystal)[0].id : 0;
      let parentParentCrystal = parentCrystal?.parentCrystal ? this.crystals.filter((c: { id: any; }) => c.id === parentCrystal.parentCrystal)[0].id : 0;
      let parentParentParentCrystal = parentParentCrystal?.parentCrystal ? this.crystals.filter((c: { id: any; }) => c.id === parentParentCrystal.parentCrystal)[0].id : 0;

      if (parentParentParentCrystal) {
        this.userCrystalsOfType[parentParentParentCrystal].children[parentParentCrystal].children[parentCrystal].children[crystal.id].crystals = this.userCrystalsOfType[parentParentParentCrystal].children[parentParentCrystal].children[parentCrystal].children[crystal.id].crystals.filter((c: { id: any; }) => c.id !== userCrystal.id);
      } else if (parentParentCrystal) {
        this.userCrystalsOfType[parentParentCrystal].children[parentCrystal].children[crystal.id].crystals = this.userCrystalsOfType[parentParentCrystal].children[parentCrystal].children[crystal.id].crystals.filter((c: { id: any; }) => c.id !== userCrystal.id);
      } else if (parentCrystal) {
        this.userCrystalsOfType[parentCrystal].children[crystal.id].crystals = this.userCrystalsOfType[parentCrystal].children[crystal.id].crystals.filter((c: { id: any; }) => c.id !== userCrystal.id);
      } else {
        this.userCrystalsOfType[crystal.id].crystals = this.userCrystalsOfType[crystal.id].crystals.filter((c: { id: any; }) => c.id !== userCrystal.id);
      }

      this.userCrystals = this.userCrystals.filter((uc: { id: number; }) => uc.id != id);

      this.backendService.deleteUserCrystal(id).subscribe(s => {

      });
    }
  }

  saveDisabled(id: number) {
    return !this.crystalForms[id].valid;
  }

  addUserCrystal(status: number) {
    if (this.addCrystalForm.controls['crystal'].value) {
      this.backendService.addCrystalToCollection(this.addCrystalForm.controls['crystal'].value, this.user.id, status).subscribe(s => {
        this.crystalForms[s.crystal.id] = new FormGroup({
          id: new FormControl(s.crystal.id),
          name: new FormControl(''),
          primaryColor: new FormControl(null),
          secondaryColor: new FormControl(null),
          tertiaryColor: new FormControl(null),
          sizeX: new FormControl(''),
          sizeY: new FormControl(''),
          sizeZ: new FormControl(''),
          weight: new FormControl(''),
          karat: new FormControl(''),
          cut: new FormControl(''),
          aura: new FormControl(''),
          status: new FormControl(s.crystal.status),
          shape: new FormControl(s.crystal.shape),
          subType: new FormControl(s.crystal.subType)
        });

        this.addUserCrystalOfType(s.crystal);
        this.userCrystals.push(s.crystal);
      });
    } else {
      alert('Select a crystal using the dropdown first.');
    }
  }

  saveAllUserCrystals() {
    this.loading = true;
    let subscriptions: Observable<any>[] = [];

    this.userCrystals.map((uc: { id: number; }) => {
      subscriptions.push(this.backendService.saveUserCrystal(this.crystalForms[uc.id].value));
    });

    zip(...subscriptions).subscribe(() => {
      this.loading = false;
    });
  }

  addUserCrystalOfType(userCrystal: any) {
    let crystal = this.crystals.filter((c: { id: any; }) => c.id === userCrystal.crystal)[0];
    let parentCrystal = crystal.parentCrystal ? this.crystals.filter((c: { id: any; }) => c.id === crystal.parentCrystal)[0] : null;
    let parentParentCrystal = parentCrystal?.parentCrystal ? this.crystals.filter((c: { id: any; }) => c.id === parentCrystal.parentCrystal)[0] : null;
    let parentParentParentCrystal = parentParentCrystal?.parentCrystal ? this.crystals.filter((c: { id: any; }) => c.id === parentParentCrystal.parentCrystal)[0] : null;

    if (parentParentParentCrystal) {
      if (this.userCrystalsOfType[parentParentParentCrystal.id] === undefined) {
        this.userCrystalsOfType[parentParentParentCrystal.id] = {
          crystals: [],
          children: []
        };
      }

      if (this.userCrystalsOfType[parentParentParentCrystal.id].children[parentParentCrystal.id] === undefined) {
        this.userCrystalsOfType[parentParentParentCrystal.id].children[parentParentCrystal.id] = {
          crystals: [],
          children: []
        };
      }

      if (this.userCrystalsOfType[parentParentParentCrystal.id].children[parentParentCrystal.id].children[parentCrystal.id] === undefined) {
        this.userCrystalsOfType[parentParentParentCrystal.id].children[parentParentCrystal.id].children[parentCrystal.id] = {
          crystals: [],
          children: []
        };
      }

      if (this.userCrystalsOfType[parentParentParentCrystal.id].children[parentParentCrystal.id].children[parentCrystal.id].children[crystal.id] === undefined) {
        this.userCrystalsOfType[parentParentParentCrystal.id].children[parentParentCrystal.id].children[parentCrystal.id].children[crystal.id] = {
          crystals: [],
          children: []
        };
      }

      this.userCrystalsOfType[parentParentParentCrystal.id].children[parentParentCrystal.id].children[parentCrystal.id].children[crystal.id].crystals.push(userCrystal);
    } else if (parentParentCrystal) {
      if (this.userCrystalsOfType[parentParentCrystal.id] === undefined) {
        this.userCrystalsOfType[parentParentCrystal.id] = {
          crystals: [],
          children: []
        };
      }

      if (this.userCrystalsOfType[parentParentCrystal.id].children[parentCrystal.id] === undefined) {
        this.userCrystalsOfType[parentParentCrystal.id].children[parentCrystal.id] = {
          crystals: [],
          children: []
        };
      }

      if (this.userCrystalsOfType[parentParentCrystal.id].children[parentCrystal.id].children[crystal.id] === undefined) {
        this.userCrystalsOfType[parentParentCrystal.id].children[parentCrystal.id].children[crystal.id] = {
          crystals: [],
          children: []
        };
      }

      this.userCrystalsOfType[parentParentCrystal.id].children[parentCrystal.id].children[crystal.id].crystals.push(userCrystal);
    } else if (parentCrystal) {
      if (this.userCrystalsOfType[parentCrystal.id] === undefined) {
        this.userCrystalsOfType[parentCrystal.id] = {
          crystals: [],
          children: []
        };
      }

      if (this.userCrystalsOfType[parentCrystal.id].children[crystal.id] === undefined) {
        this.userCrystalsOfType[parentCrystal.id].children[crystal.id] = {
          crystals: [],
          children: []
        };
      }

      this.userCrystalsOfType[parentCrystal.id].children[crystal.id].crystals.push(userCrystal);
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
      for (let uc of this.getFilteredUserCrystals()) {
        this.addUserCrystalOfType(uc);
      }
    } else {
      for (let uc of this.getFilteredUserCrystals()) {
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

  getFilteredUserCrystals() {
    return this.userCrystals.filter((uc: { crystal: number; shape: number|null; status: number|null; primaryColor: number|null; secondaryColor: number|null; tertiaryColor: number|null}) => {
      let crystal = this.crystals.filter((c: { id: number; }) => c.id === uc.crystal)[0];

      let containsChakra = this.filterForm.controls["chakras"].value.length === 0 || crystal.CrystalChakras.filter((cc: { chakraId: number; }) => this.filterForm.controls["chakras"].value.includes(cc.chakraId)).length > 0;
      let containsCleansing = this.filterForm.controls["cleansings"].value.length === 0 || crystal.CrystalCleansings.filter((cc: { cleansingId: number; }) => this.filterForm.controls["cleansings"].value.includes(cc.cleansingId)).length > 0;
      let containsDomain = this.filterForm.controls["domains"].value.length === 0 || crystal.CrystalDomains.filter((cd: { domainId: number; }) => this.filterForm.controls["domains"].value.includes(cd.domainId)).length > 0;
      let containsElement = this.filterForm.controls["elements"].value.length === 0 || crystal.CrystalElements.filter((ce: { elementId: number; }) => this.filterForm.controls["elements"].value.includes(ce.elementId)).length > 0;
      let containsMoonPhase = this.filterForm.controls["moonPhases"].value.length === 0 || crystal.CrystalMoonPhases.filter((cm: { moonPhaseId: number; }) => this.filterForm.controls["moonPhases"].value.includes(cm.moonPhaseId)).length > 0;
      let containsZodiac = this.filterForm.controls["zodiacs"].value.length === 0 || crystal.CrystalZodiacs.filter((cz: {zodiacId: number; }) => this.filterForm.controls["zodiacs"].value.includes(cz.zodiacId)).length > 0;
      let containsShape = this.filterForm.controls["shapes"].value.length === 0 || this.filterForm.controls["shapes"].value.includes(uc.shape);
      let containsStatus = this.filterForm.controls["statuses"].value.length === 0 || this.filterForm.controls["statuses"].value.includes(uc.status);
      let containsColor = this.filterForm.controls["colors"].value.length === 0 || this.filterForm.controls["colors"].value.includes(uc.primaryColor) || this.filterForm.controls["colors"].value.includes(uc.secondaryColor) || this.filterForm.controls["colors"].value.includes(uc.tertiaryColor);

      return containsChakra && containsCleansing && containsDomain && containsElement && containsMoonPhase && containsZodiac && containsShape && containsStatus && containsColor;
    });
  }

  filter() {
    this.buildUserCrystals();
  }

  clearFilters() {
    this.filterForm.patchValue({
      chakras: [],
      cleansings: [],
      domains: [],
      elements: [],
      moonPhases: [],
      zodiacs: [],
      shapes: [],
      statuses: [],
      colors: []
    });
  }

  protected filterCrystals() {
    if (!this.crystals) {
      return;
    }
    // get the search keyword
    let search = this.crystalFilterCtrl.value;
    if (!search) {
      this.filteredCrystals.next(this.crystals.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the crystals
    this.filteredCrystals.next(
      this.crystals.filter((c: { crystal: string; }) => c.crystal.toLowerCase().indexOf(search) > -1)
    );
  }

  backTopTop() {
    window.scroll(0, 0);
  }
}
