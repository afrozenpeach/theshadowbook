import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrystalsComponent } from './crystals.component';

describe('CrystalsComponent', () => {
  let component: CrystalsComponent;
  let fixture: ComponentFixture<CrystalsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CrystalsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CrystalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
