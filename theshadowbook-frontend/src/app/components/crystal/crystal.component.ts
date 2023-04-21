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

  chakras: any = [];
  cleansings: any = [];
  domains: any = [];
  elements: any = [];
  moonPhases: any = [];
  zodiacs: any = [];

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
                  this.name = params.get('name');

                  if (this.name != null) {
                    this.backendService.getCrystal(this.name).subscribe((crystal) => {
                      this.crystal = crystal.crystal;
                    });
                  }
                });
              });
            });
          });
        });
      });
    });

    this.authService.IsAdmin.subscribe(isAdmin => {
      this.isAdmin = isAdmin;
    })
  }

  getChakraName(id: any) {
    return this.chakras.filter((f: { id: any; }) => f.id === id)[0].chakra;
  }

  getCleansingName(id: any) {
    return this.cleansings.filter((f: { id: any; }) => f.id === id)[0].cleansing;
  }

  getDomainName(id: any) {
    return this.domains.filter((f: { id: any; }) => f.id === id)[0].domain;
  }

  getElementName(id: any) {
    return this.elements.filter((f: { id: any; }) => f.id === id)[0].element;
  }

  getMoonPhaseName(id: any) {
    return this.moonPhases.filter((f: { id: any; }) => f.id === id)[0].moonPhase;
  }

  getZodiacName(id: any) {
    return this.zodiacs.filter((f: { id: any; }) => f.id === id)[0].sign;
  }
}
