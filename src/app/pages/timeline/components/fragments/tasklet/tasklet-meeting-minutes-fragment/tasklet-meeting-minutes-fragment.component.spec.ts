import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskletMeetingMinutesFragmentComponent } from './tasklet-meeting-minutes-fragment.component';

describe('TaskletMeetingMinutesFragmentComponent', () => {
  let component: TaskletMeetingMinutesFragmentComponent;
  let fixture: ComponentFixture<TaskletMeetingMinutesFragmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TaskletMeetingMinutesFragmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskletMeetingMinutesFragmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
