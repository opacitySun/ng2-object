import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoConfirmComponent } from './info-confirm.component';

describe('InfoConfirmComponent', () => {
  let component: InfoConfirmComponent;
  let fixture: ComponentFixture<InfoConfirmComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InfoConfirmComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoConfirmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
