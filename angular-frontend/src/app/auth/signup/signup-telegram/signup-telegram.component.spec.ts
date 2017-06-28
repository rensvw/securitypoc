import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SignupTelegramComponent } from './signup-telegram.component';

describe('SignupTelegramComponent', () => {
  let component: SignupTelegramComponent;
  let fixture: ComponentFixture<SignupTelegramComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SignupTelegramComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SignupTelegramComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
