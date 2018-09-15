import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {DateTimePickerFragmentComponent} from './date-time-picker-fragment.component';

describe('DateTimePickerFragmentComponent', () => {
  let component: DateTimePickerFragmentComponent;
  let fixture: ComponentFixture<DateTimePickerFragmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DateTimePickerFragmentComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DateTimePickerFragmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
