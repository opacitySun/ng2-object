import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PayTypeComponent } from './pay-type.component';

describe('PayTypeComponent', () => {
  let component: PayTypeComponent;
  let fixture: ComponentFixture<PayTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PayTypeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PayTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
