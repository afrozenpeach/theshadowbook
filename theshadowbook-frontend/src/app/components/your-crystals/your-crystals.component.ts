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
  subTypes: any = [];

  crystalForms: FormGroup[] = [];
  addCrystalForm: FormGroup = new FormGroup({
    crystal: new FormControl('')
  });

  userCrystalsOfType: any = [];
  subTypesOfCrystal: any = [];

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
                  subType: new FormControl(userCrystal.subType)
                });

                if (!this.userCrystalsOfType[userCrystal.crystal]) {
                  this.userCrystalsOfType[userCrystal.crystal] = [];
                }

                if (!this.userCrystalsOfType[userCrystal.crystal][userCrystal.subType ?? 0]) {
                  this.userCrystalsOfType[userCrystal.crystal][userCrystal.subType ?? 0] = [];
                }

                this.userCrystalsOfType[userCrystal.crystal][userCrystal.subType ?? 0].push(userCrystal);
              }

              this.userCrystals = uc.crystals;

              this.userCrystals.map((c: { id: string | number; }) => {
                this.subTypesOfCrystal[c.id] = [];
                this.subTypesOfCrystal[c.id].push({
                  id: 0,
                  crystal: c.id,
                  type: ''
                });
              });

              this.backendService.getCrystalSubTypes().subscribe(s => {
                this.subTypes = s.crystalSubTypes

                this.subTypes.map((st: {id: any; crystal: string | number; }) => {
                  this.subTypesOfCrystal[st.crystal].push(st);
                });

                this.backendService.getCrystals().subscribe(c => {
                  this.crystals = c.crystals;

                  this.loading = false;
                });
              });
            });
          });
        });
      });
    });
  }

  getUserCrystalsOfType(id: number) {
    return this.userCrystals.filter((uc: {crystal: number;}) => uc.crystal === id);
  }

  getSubTypesOfCrystal(id: number) {
    let returnValue = this.subTypes.filter((s: { crystal: number; }) => s.crystal === id);
    returnValue.unshift({id: null, crystal: id, type: ''});
    return returnValue;
  }

  getSubTypesOfType(id: number) {
    return this.subTypes.filter((s: { crystal: number; }) => s.crystal === id);
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
