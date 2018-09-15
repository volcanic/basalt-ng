import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {CalendarGridDayComponent} from './calendar-grid-day.component';

describe('CalendarGridDayComponent', () => {
  let component: CalendarGridDayComponent;
  let fixture: ComponentFixture<CalendarGridDayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CalendarGridDayComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CalendarGridDayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
