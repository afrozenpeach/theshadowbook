import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
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
  cuts: any = [];
  colors: any = [];
  statuses: any = [];

  crystalForm: FormGroup[] = [];

  constructor(private backendService: BackendService) {

  }

  ngOnInit() {
    this.backendService.getUser().subscribe(u => {
      this.user = u.user;

      this.backendService.getCrystals().subscribe(c => {
        this.crystals = c.crystals;

        this.backendService.getUserCrystals(this.user.id).subscribe(uc => {
          this.userCrystals = uc.crystals;

          this.backendService.getCuts().subscribe(c => {
            this.cuts = c.cuts;

            this.backendService.getColors().subscribe(c => {
              this.colors = c.colors;

              this.backendService.getStatuses().subscribe(s => {
                this.statuses = s.statuses;

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
              status: new FormControl(userCrystal.status)
            });
          }
        });
      });
    });
  }

  getUserCrystalsOfType(id: number) {
    return this.userCrystals.filter((uc: {crystal: number;}) => uc.crystal === id);
  }

  save(id: number) {
    return this.backendService.saveUserCrystal(this.crystalForm[id].value).subscribe(s => {

    });
  }

  saveDisabled(id: number) {
    return !this.crystalForm[id].valid;
  }
}
