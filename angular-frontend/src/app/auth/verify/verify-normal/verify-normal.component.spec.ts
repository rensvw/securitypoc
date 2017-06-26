import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VerifyNormalComponent } from './verify-normal.component';

describe('VerifyNormalComponent', () => {
  let component: VerifyNormalComponent;
  let fixture: ComponentFixture<VerifyNormalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VerifyNormalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VerifyNormalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
