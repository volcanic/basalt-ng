import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {RecurrenceIntervalFragmentComponent} from './recurrence-interval-fragment.component';

describe('RecurrenceIntervalFragmentComponent', () => {
  let component: RecurrenceIntervalFragmentComponent;
  let fixture: ComponentFixture<RecurrenceIntervalFragmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [RecurrenceIntervalFragmentComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecurrenceIntervalFragmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
