import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
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
  subTypes: any = [];

  crystal: any = {};
  isAdmin: boolean = false;

  crystalForm = new FormGroup({
    id: new FormControl(''),
    crystal: new FormControl('', Validators.required),
    chakras: new FormControl([]),
    cleansings: new FormControl([]),
    domains: new FormControl([]),
    elements: new FormControl([]),
    moonPhases: new FormControl([]),
    zodiacs: new FormControl([])
  });

  subTypeForm: FormGroup[] = [];

  addSubTypeForm = new FormGroup({
    crystal: new FormControl(''),
    type: new FormControl('', Validators.required)
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
                          this.subTypes = this.crystal.CrystalSubTypes;

                          this.crystal.CrystalSubTypes.map((s: any) => {
                            this.subTypeForm[s.id] = new FormGroup({
                              id: new FormControl(s.id),
                              crystal: new FormControl(s.crystal),
                              type: new FormControl(s.type)
                            });
                          });

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

                          this.addSubTypeForm.patchValue({
                            crystal: this.crystal.id
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
    if (this.id === 'new') {
      this.backendService.createCrystal(this.crystalForm.value).subscribe((success) => {
        if (success.success) {
          this.router.navigate(['/crystals/' + this.crystalForm.controls['crystal'].value]);
        } else {
          alert(success.error.errors[0].message);
        }
      });
    } else {
      this.backendService.updateCrystal(this.crystalForm.value).subscribe((success) => {
        if (success.success) {
          this.router.navigate(['/crystals/' + this.crystalForm.controls['crystal'].value]);
        } else {
          alert(success.error.errors[0].message);
        }
      });
    }
  }

  saveSubType(id: number) {
    return false;
  }

  addSubType() {
    this.backendService.addCrystalSubType(parseInt(this.addSubTypeForm.controls['crystal'].value ?? ''), this.addSubTypeForm.controls['type'].value ?? '').subscribe(s => {
      this.subTypes.push(s.crystalSubTypes);
    });
  }

  deleteSubType(id: number) {
    this.backendService.deleteCrystalSubType(id).subscribe(s => {

    });
  }
}
