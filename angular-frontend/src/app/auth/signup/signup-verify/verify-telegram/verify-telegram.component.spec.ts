import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SignupVerifyTelegramComponent } from './verify-telegram.component';

describe('SignupVerifyTelegramComponent', () => {
  let component: SignupVerifyTelegramComponent;
  let fixture: ComponentFixture<SignupVerifyTelegramComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SignupVerifyTelegramComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SignupVerifyTelegramComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
