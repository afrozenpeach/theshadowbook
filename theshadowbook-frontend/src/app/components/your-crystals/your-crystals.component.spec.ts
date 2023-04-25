import { ComponentFixture, TestBed } from '@angular/core/testing';

import { YourCrystalsComponent } from './your-crystals.component';

describe('YourCrystalsComponent', () => {
  let component: YourCrystalsComponent;
  let fixture: ComponentFixture<YourCrystalsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ YourCrystalsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(YourCrystalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
