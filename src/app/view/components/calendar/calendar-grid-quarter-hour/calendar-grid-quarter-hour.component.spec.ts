import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CalendarGridHourComponent } from './calendar-grid-quarter-hour.component';

describe('CalendarGridHourComponent', () => {
  let component: CalendarGridHourComponent;
  const fixture: ComponentFixture<CalendarGridHourComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CalendarGridHourComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CalendarGridHourComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
