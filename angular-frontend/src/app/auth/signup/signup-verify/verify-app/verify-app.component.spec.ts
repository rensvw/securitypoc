import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VerifyAppComponent } from './verify-app.component';

describe('VerifyAppComponent', () => {
  let component: VerifyAppComponent;
  let fixture: ComponentFixture<VerifyAppComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VerifyAppComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VerifyAppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
