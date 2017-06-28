import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginTelegramComponent } from './login-telegram.component';

describe('LoginTelegramComponent', () => {
  let component: LoginTelegramComponent;
  let fixture: ComponentFixture<LoginTelegramComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoginTelegramComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginTelegramComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
