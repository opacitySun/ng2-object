import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardDatePickerComponent } from './card-date-picker.component';

describe('CardDatePickerComponent', () => {
  let component: CardDatePickerComponent;
  let fixture: ComponentFixture<CardDatePickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CardDatePickerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CardDatePickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
