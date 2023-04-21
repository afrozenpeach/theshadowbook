import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { BackendService } from 'src/app/services/backend.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  userData: any = {};
  zodiac: any = [];

  userForm = new FormGroup({
    name: new FormControl('', Validators.required),
    profile: new FormControl(''),
    sunSign: new FormControl(''),
    moonSign: new FormControl(''),
    risingSign: new FormControl('')
  })

  constructor(
    private backendService: BackendService,
    public authService: AuthService,
    private angularFireAuth: AngularFireAuth,
    public router: Router) {
  }

  ngOnInit(): void {
    this.backendService.getZodiacs().subscribe(zodiacData => {
      this.zodiac = zodiacData;

      this.backendService.getUser().subscribe(userData => {
        this.userData = userData;

        if (this.userData.user === undefined) {
          //The user account has been created, but their profile hasn't been
          this.backendService.createUser().subscribe();
        } else {
          //Sync email addresses between firebase and mysql
          this.angularFireAuth.user.subscribe(user => {
            if (user?.email !== this.userData.user.email) {
              this.backendService.updateUserEmail({
                id: this.userData.user.id,
                email: user?.email
              }).subscribe();
            }
          })

          //update form
          this.userForm.patchValue({
            name: this.userData.user.name,
            profile: this.userData.user.profile,
            sunSign: this.userData.user.sunSign,
            moonSign: this.userData.user.moonSign,
            risingSign: this.userData.user.risingSign
          })
        }
      })
    })
  }

  onSubmit() {
    this.backendService.isValidUserName(this.userForm.value.name).subscribe((data) => {
      if (data.isValid) {
        this.userForm.controls['name'].setErrors(null);

        this.backendService.updateUser({
          name: this.userForm.value.name,
          profile: this.userForm.value.profile,
          id: this.userData.user.id,
          sunSign: this.userForm.value.sunSign,
          moonSign: this.userForm.value.moonSign,
          risingSign: this.userForm.value.risingSign
        }).subscribe();
      } else {
        this.userForm.controls['name'].setErrors({'invalid': true});
      }
    });
  }
}
