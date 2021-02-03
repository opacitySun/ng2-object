import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerifyFailComponent } from './verify-fail.component';

describe('VerifyFailComponent', () => {
  let component: VerifyFailComponent;
  let fixture: ComponentFixture<VerifyFailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VerifyFailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VerifyFailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
