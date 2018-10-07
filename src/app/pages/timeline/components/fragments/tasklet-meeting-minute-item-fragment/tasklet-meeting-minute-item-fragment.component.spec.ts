import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskletMeetingMinuteItemFragmentComponent } from './tasklet-meeting-minute-item-fragment.component';

describe('TaskletMeetingMinuteItemFragmentComponent', () => {
  let component: TaskletMeetingMinuteItemFragmentComponent;
  let fixture: ComponentFixture<TaskletMeetingMinuteItemFragmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TaskletMeetingMinuteItemFragmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskletMeetingMinuteItemFragmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
