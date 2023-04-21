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

  constructor(
    private backendService: BackendService,
    private authService: AuthService,
    public router: Router
    ) {
  }

  ngOnInit() {
    this.backendService.getCrystals().subscribe(crystals => {
      this.crystals = crystals.crystals;
    });

    this.authService.IsAdmin.subscribe(isAdmin => {
      this.isAdmin = isAdmin;
    })
  }
}
