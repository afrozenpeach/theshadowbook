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

  crystalForm: FormGroup[] = [];
  addCrystalForm: FormGroup = new FormGroup({
    crystal: new FormControl('')
  });

  loading = true;

  constructor(private backendService: BackendService) {

  }

  ngOnInit() {
    this.backendService.getUser().subscribe(u => {
      this.user = u.user;

      this.backendService.getCrystals().subscribe(c => {
        this.crystals = c.crystals;

        this.backendService.getUserCrystals(this.user.id).subscribe(uc => {
          this.userCrystals = uc.crystals;

          this.backendService.getCrystalColors().subscribe(c => {
            this.colors = c.colors;

            this.backendService.getStatuses().subscribe(s => {
              this.statuses = s.statuses;

              this.backendService.getCrystalShapes().subscribe(s => {
                this.shapes = s.shapes;

                this.backendService.getCrystalSubTypes().subscribe(s => {
                  this.subTypes = s.crystalSubTypes
                  this.loading = false;
                });
              });
            });
          });

          for (let userCrystal of this.userCrystals) {
            this.crystalForm[userCrystal.id] = new FormGroup({
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
          }
        });
      });
    });
  }

  getUserCrystalsOfType(id: number) {
    return this.userCrystals.filter((uc: {crystal: number;}) => uc.crystal === id);
  }

  getSubTypesOfType(id: number) {
    return this.subTypes.filter((s: { crystal: number; }) => s.crystal === id);
  }

  saveUserCrystal(id: number) {
    this.backendService.saveUserCrystal(this.crystalForm[id].value).subscribe(s => {

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
    return !this.crystalForm[id].valid;
  }

  addUserCrystal(status: number) {
    if (this.addCrystalForm.controls['crystal'].value) {
      this.backendService.addCrystalToCollection(this.addCrystalForm.controls['crystal'].value, this.user.id, status).subscribe(s => {
        this.crystalForm[s.crystal.id] = new FormGroup({
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
      subscriptions.push(this.backendService.saveUserCrystal(this.crystalForm[uc.id].value));
    });

    zip(...subscriptions).subscribe(() => {
      this.loading = false;
    });
  }
}
