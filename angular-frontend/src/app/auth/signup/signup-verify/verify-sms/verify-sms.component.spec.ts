import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SignupVerifySmsComponent } from './verify-sms.component';

describe('VerifySmsComponent', () => {
  let component: SignupVerifySmsComponent;
  let fixture: ComponentFixture<SignupVerifySmsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SignupVerifySmsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SignupVerifySmsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
