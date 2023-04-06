import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { FormControl, FormGroup } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { BackendService } from 'src/app/services/backend.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  userData: any = [];
  zodiac: any = [];

  userForm = new FormGroup({
    name: new FormControl(''),
    profile: new FormControl(''),
    sunSign: new FormControl(''),
    moonSign: new FormControl(''),
    risingSign: new FormControl('')
  })

  constructor(
    private backendService: BackendService,
    public authService: AuthService) {
  }

  ngOnInit(): void {
    this.backendService.getZodiac().subscribe(data => {
      this.zodiac = data;
    })

    this.backendService.getUser().subscribe(data => {
      this.userData = data;

      if (this.userData.user === undefined) {
        this.backendService.createUser().subscribe();
      } else {
        this.userForm.patchValue({
          name: this.userData.user.name,
          profile: this.userData.user.profile,
          sunSign: this.userData.user.sunSign,
          moonSign: this.userData.user.moonSign,
          risingSign: this.userData.user.risingSign
        })
      }
    })
  }

  onSubmit() {
    this.backendService.updateUser({
      name: this.userForm.value.name,
      profile: this.userForm.value.profile,
      id: this.userData.user.id,
      sunSign: this.userForm.value.sunSign,
      moonSign: this.userForm.value.moonSign,
      risingSign: this.userForm.value.risingSign
    }).subscribe();
  }
}
