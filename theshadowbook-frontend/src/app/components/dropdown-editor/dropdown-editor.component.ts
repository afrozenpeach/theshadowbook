import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { BackendService } from 'src/app/services/backend.service';

@Component({
  selector: 'app-dropdown-editor',
  templateUrl: './dropdown-editor.component.html',
  styleUrls: ['./dropdown-editor.component.scss']
})
export class DropdownEditorComponent {
  colors: any = [];
  domains: any = [];
  shapes: any = [];

  addColorForm = new FormGroup({
    color: new FormControl('')
  });

  addDomainForm = new FormGroup({
    domain: new FormControl('')
  });

  constructor(private backendService: BackendService) {

  }

  ngOnInit() {
    this.backendService.getColors().subscribe(c => {
      this.colors = c.colors;
    });

    this.backendService.getDomains().subscribe(d => {
      this.domains = d.domains;
    });
  }

  addColor() {
    if (this.addColorForm.controls['color'].value) {
      this.backendService.addColor(this.addColorForm.controls['color'].value).subscribe(c => {

      })
    }
  }

  addDomain() {
    if (this.addDomainForm.controls['domain'].value) {
      this.backendService.addDomain(this.addDomainForm.controls['domain'].value).subscribe(d => {

      });
    }
  }
}
