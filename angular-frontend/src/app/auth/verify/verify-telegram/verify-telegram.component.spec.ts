import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VerifyTelegramComponent } from './verify-telegram.component';

describe('VerifyTelegramComponent', () => {
  let component: VerifyTelegramComponent;
  let fixture: ComponentFixture<VerifyTelegramComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VerifyTelegramComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VerifyTelegramComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
