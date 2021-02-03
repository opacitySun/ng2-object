import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BottomMoneyBoxComponent } from './bottom-money-box.component';

describe('BottomMoneyBoxComponent', () => {
  let component: BottomMoneyBoxComponent;
  let fixture: ComponentFixture<BottomMoneyBoxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BottomMoneyBoxComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BottomMoneyBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
