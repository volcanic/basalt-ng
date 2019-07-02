import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {CalendarGridQuarterHourComponent} from './calendar-grid-quarter-hour.component';
import {CalendarImports} from '../../calendar.imports';
import {CalendarDeclarations} from '../../calendar.declaration';

describe('CalendarGridQuarterHourComponent', () => {
  let component: CalendarGridQuarterHourComponent;
  let fixture: ComponentFixture<CalendarGridQuarterHourComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [CalendarImports],
      declarations: [CalendarDeclarations],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CalendarGridQuarterHourComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
