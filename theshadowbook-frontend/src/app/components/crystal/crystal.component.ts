import { Component } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { BackendService } from 'src/app/services/backend.service';

@Component({
  selector: 'app-crystal',
  templateUrl: './crystal.component.html',
  styleUrls: ['./crystal.component.scss']
})
export class CrystalComponent {
  name: String|null = '';
  crystal: any = {};

  constructor(
    private backendService: BackendService,
    private route: ActivatedRoute
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
  }
}
