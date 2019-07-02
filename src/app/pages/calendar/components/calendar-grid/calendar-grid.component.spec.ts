import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {CalendarGridComponent} from './calendar-grid.component';
import {CalendarImports} from '../../calendar.imports';
import {CalendarDeclarations} from '../../calendar.declaration';

describe('CalendarGridComponent', () => {
  let component: CalendarGridComponent;
  let fixture: ComponentFixture<CalendarGridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [CalendarImports],
      declarations: [CalendarDeclarations],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CalendarGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
