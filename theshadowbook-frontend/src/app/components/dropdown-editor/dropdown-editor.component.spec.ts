import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DropdownEditorComponent } from './dropdown-editor.component';

describe('DropdownEditorComponent', () => {
  let component: DropdownEditorComponent;
  let fixture: ComponentFixture<DropdownEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DropdownEditorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DropdownEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
