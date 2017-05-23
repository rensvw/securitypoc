import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SignupAppComponent } from './signup-app.component';

describe('SignupAppComponent', () => {
  let component: SignupAppComponent;
  let fixture: ComponentFixture<SignupAppComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SignupAppComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SignupAppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
