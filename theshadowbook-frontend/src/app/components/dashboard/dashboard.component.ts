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
  userData: any;
  userForm = new FormGroup({
    name: new FormControl(''),
    profile: new FormControl('')
  })

  constructor(
    private backendService: BackendService,
    public authService: AuthService,
    private angularFireAuth: AngularFireAuth) {
  }

  ngOnInit(): void {
    this.backendService.getUser().subscribe(data => {
      this.userData = data;
      this.userForm.patchValue({
        name: this.userData.user.name,
        profile: this.userData.user.profile
      })
    })
  }

  onSubmit() {
    this.backendService.updateUser({
      name: this.userForm.value.name,
      profile: this.userForm.value.profile,
      id: this.userData.user.id
    }).subscribe();
  }
}
