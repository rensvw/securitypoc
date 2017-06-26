import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginSmsComponent } from './login-sms.component';

describe('LoginSmsComponent', () => {
  let component: LoginSmsComponent;
  let fixture: ComponentFixture<LoginSmsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoginSmsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginSmsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
