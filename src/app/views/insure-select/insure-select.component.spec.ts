import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InsureSelectComponent } from './insure-select.component';

describe('InsureSelectComponent', () => {
  let component: InsureSelectComponent;
  let fixture: ComponentFixture<InsureSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InsureSelectComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InsureSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
