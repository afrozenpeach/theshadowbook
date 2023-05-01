import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Observable, zip } from 'rxjs';
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

  crystalForms: FormGroup[] = [];
  addCrystalForm: FormGroup = new FormGroup({
    crystal: new FormControl('')
  });

  userCrystalsOfType: any = [];

  loading = true;

  constructor(private backendService: BackendService) {

  }

  ngOnInit() {
    this.backendService.getColors().subscribe(c => {
      this.colors = c.colors;

      this.backendService.getStatuses().subscribe(s => {
        this.statuses = s.statuses;

        this.backendService.getShapes().subscribe(s => {
          this.shapes = s.shapes;

          this.backendService.getUser().subscribe(u => {
            this.user = u.user;

            this.backendService.getCrystals().subscribe(c => {
              this.crystals = c.crystals;

              this.backendService.getUserCrystals(this.user.id).subscribe(uc => {
                for (let userCrystal of uc.crystals) {
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
                this.userCrystals = uc.crystals;
                console.log(this.userCrystalsOfType);
                this.loading = false;
              });
            });
          });
        });
      });
    });
  }

  getCrystals() {
    return this.crystals.filter((c: { parentCrystal: null; }) => c.parentCrystal === null);
  }

  getCrystal(id: number) {
    return this.crystals.filter((c: { id: null; }) => c.id === id)[0];
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
      this.backendService.deleteUserCrystal(id).subscribe(s => {
        this.userCrystals = this.userCrystals.filter((uc: { id: number; }) => uc.id != id);
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
}
