import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SignupVerifyAppComponent } from './verify-app.component';

describe('SignupVerifyAppComponent', () => {
  let component: SignupVerifyAppComponent;
  let fixture: ComponentFixture<SignupVerifyAppComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SignupVerifyAppComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SignupVerifyAppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
