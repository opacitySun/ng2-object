import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PayFailComponent } from './pay-fail.component';

describe('PayFailComponent', () => {
  let component: PayFailComponent;
  let fixture: ComponentFixture<PayFailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PayFailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PayFailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
