import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {CalendarGridComponent} from './calendar-grid.component';

describe('CalendarGridComponent', () => {
  let component: CalendarGridComponent;
  let fixture: ComponentFixture<CalendarGridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CalendarGridComponent]
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
