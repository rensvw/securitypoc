import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SignupTelegramSubscribeComponent } from './signup-telegram-subscribe.component';

describe('SignupTelegramSubscribeComponent', () => {
  let component: SignupTelegramSubscribeComponent;
  let fixture: ComponentFixture<SignupTelegramSubscribeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SignupTelegramSubscribeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SignupTelegramSubscribeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
