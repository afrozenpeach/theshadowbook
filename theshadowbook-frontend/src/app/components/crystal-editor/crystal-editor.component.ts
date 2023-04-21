import { Component } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { BackendService } from 'src/app/services/backend.service';

@Component({
  selector: 'app-crystal-editor',
  templateUrl: './crystal-editor.component.html',
  styleUrls: ['./crystal-editor.component.scss']
})
export class CrystalEditorComponent {
  id: String|null = '';

  chakras: any = [];
  cleansings: any = [];
  domains: any = [];
  elements: any = [];
  moonPhases: any = [];
  zodiacs: any = [];

  crystal: any = {};
  isAdmin: boolean = false;

  crystalForm = new FormGroup({
    id: new FormControl('', Validators.required),
    crystal: new FormControl('', Validators.required),
    chakras: new FormControl([]),
    cleansings: new FormControl([]),
    domains: new FormControl([]),
    elements: new FormControl([]),
    moonPhases: new FormControl([]),
    zodiacs: new FormControl([])
  })

  constructor(
    private backendService: BackendService,
    private route: ActivatedRoute,
    private authService: AuthService,
    public router: Router
  ) {

  }

  ngOnInit() {
    this.authService.IsAdmin.subscribe(isAdmin => {
      this.isAdmin = isAdmin;

      if (this.isAdmin) {
        this.backendService.getChakras().subscribe(chakras => {
          this.chakras = chakras.chakras;

          this.backendService.getCleansings().subscribe(cleansings => {
            this.cleansings = cleansings.cleansings;

            this.backendService.getDomains().subscribe(domains => {
              this.domains = domains.domains;

              this.backendService.getElements().subscribe(elements => {
                this.elements = elements.elements;

                this.backendService.getMoonPhases().subscribe(moonPhases => {
                  this.moonPhases = moonPhases.moonPhases;

                  this.backendService.getZodiacs().subscribe(zodiacs => {
                    this.zodiacs = zodiacs.zodiacs;

                    this.route.paramMap.subscribe((params: ParamMap) => {
                      this.id = params.get('id');

                      if (this.id != null && this.id !== 'new') {
                        this.backendService.getCrystal(this.id).subscribe((crystal) => {
                          this.crystal = crystal.crystal;

                          this.crystalForm.patchValue({
                            id: this.crystal.id,
                            crystal: this.crystal.crystal,
                            chakras: this.crystal.CrystalChakras.map((c: { chakraId: any; }) => c.chakraId),
                            cleansings: this.crystal.CrystalCleansings.map((c: { cleansingId: any; }) => c.cleansingId),
                            domains: this.crystal.CrystalDomains.map((d: { domainId: any; }) => d.domainId),
                            elements: this.crystal.CrystalElements.map((e: { elementId: any; }) => e.elementId),
                            moonPhases: this.crystal.CrystalMoonPhases.map((m: { moonPhaseId: any; }) => m.moonPhaseId),
                            zodiacs: this.crystal.CrystalZodiacs.map((z: { zodiacId: any; }) => z.zodiacId)
                          });
                        });
                      }
                    });
                  });
                });
              });
            });
          });
        });
      } else {
        this.router.navigate(['/']);
      }
    })
  }

  save() {
    this.backendService.updateCrystal(this.crystalForm.value).subscribe((success) => {
      if (success) {
        this.router.navigate(['/crystals/' + this.crystalForm.controls['crystal'].value]);
      }
    });
  }
}
