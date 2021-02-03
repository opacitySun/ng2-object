import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InsureConfirmComponent } from './insure-confirm.component';

describe('InsureConfirmComponent', () => {
  let component: InsureConfirmComponent;
  let fixture: ComponentFixture<InsureConfirmComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InsureConfirmComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InsureConfirmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
