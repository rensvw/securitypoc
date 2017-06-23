import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SignupVerifyEmailComponent } from './verify-email.component';

describe('VerifyEmailComponent', () => {
  let component: SignupVerifyEmailComponent;
  let fixture: ComponentFixture<SignupVerifyEmailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SignupVerifyEmailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SignupVerifyEmailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
