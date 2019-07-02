import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {CalendarGridDayComponent} from './calendar-grid-day.component';
import {CalendarImports} from '../../calendar.imports';
import {CalendarDeclarations} from '../../calendar.declaration';

describe('CalendarGridDayComponent', () => {
  let component: CalendarGridDayComponent;
  let fixture: ComponentFixture<CalendarGridDayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [CalendarImports],
      declarations: [CalendarDeclarations],
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
