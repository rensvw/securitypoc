import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SignupSmsComponent } from './signup-sms.component';

describe('SignupSmsComponent', () => {
  let component: SignupSmsComponent;
  let fixture: ComponentFixture<SignupSmsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SignupSmsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SignupSmsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
