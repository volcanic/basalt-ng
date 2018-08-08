import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {TimePickerDialogComponent} from './time-picker-dialog.component';

describe('TimePickerDialogComponent', () => {
  let component: TimePickerDialogComponent;
  let fixture: ComponentFixture<TimePickerDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TimePickerDialogComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TimePickerDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
