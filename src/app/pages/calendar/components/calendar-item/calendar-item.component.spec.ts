import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {CalendarItemComponent} from './calendar-item.component';
import {CalendarImports} from '../../calendar.imports';
import {CalendarDeclarations} from '../../calendar.declaration';

describe('CalendarItemComponent', () => {
  let component: CalendarItemComponent;
  let fixture: ComponentFixture<CalendarItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [CalendarImports],
      declarations: [CalendarDeclarations],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CalendarItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
