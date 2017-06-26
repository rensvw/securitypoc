import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChooseMfaComponent } from './choose-mfa.component';

describe('ChooseMfaComponent', () => {
  let component: ChooseMfaComponent;
  let fixture: ComponentFixture<ChooseMfaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChooseMfaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChooseMfaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
