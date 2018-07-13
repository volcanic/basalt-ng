import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {WeeklyDigestFragment} from './weekly-digest-fragment.component';

describe('WeeklyDigestFragment', () => {
  let component: WeeklyDigestFragment;
  const fixture: ComponentFixture<WeeklyDigestFragment>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [WeeklyDigestFragment]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WeeklyDigestFragment);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
