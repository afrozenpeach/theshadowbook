import { Component } from '@angular/core';
import { BackendService } from 'src/app/services/backend.service';

@Component({
  selector: 'app-crystals',
  templateUrl: './crystals.component.html',
  styleUrls: ['./crystals.component.scss']
})
export class CrystalsComponent {
  crystals: any = [];
  constructor(private backendService: BackendService) {
  }

  ngOnInit() {
    this.backendService.getCrystals().subscribe(crystals => {
      this.crystals = crystals.crystals;
    });
  }
}
