import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PayTimeoutComponent } from './pay-timeout.component';

describe('PayTimeoutComponent', () => {
  let component: PayTimeoutComponent;
  let fixture: ComponentFixture<PayTimeoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PayTimeoutComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PayTimeoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
