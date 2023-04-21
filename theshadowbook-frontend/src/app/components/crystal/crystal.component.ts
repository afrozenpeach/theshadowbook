import { Component } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { BackendService } from 'src/app/services/backend.service';

@Component({
  selector: 'app-crystal',
  templateUrl: './crystal.component.html',
  styleUrls: ['./crystal.component.scss']
})
export class CrystalComponent {
  name: String|null = '';
  crystal: any = {};
  isAdmin: boolean = false;

  constructor(
    private backendService: BackendService,
    private route: ActivatedRoute,
    private authService: AuthService,
    public router: Router
  ) {

  }

  ngOnInit() {
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.name = params.get('name');

      if (this.name != null) {
        this.backendService.getCrystal(this.name).subscribe((crystal) => {
          this.crystal = crystal.crystal;
        });
      }
    })

    this.authService.IsAdmin.subscribe(isAdmin => {
      this.isAdmin = isAdmin;
    })
  }
}
