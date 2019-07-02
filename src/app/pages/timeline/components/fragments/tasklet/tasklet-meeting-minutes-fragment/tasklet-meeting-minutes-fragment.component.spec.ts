import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {TaskletMeetingMinutesFragmentComponent} from './tasklet-meeting-minutes-fragment.component';
import {TimelineImports} from '../../../../timeline.imports';
import {TimelineDeclarations} from '../../../../timeline.declaration';

describe('TaskletMeetingMinutesFragmentComponent', () => {
  let component: TaskletMeetingMinutesFragmentComponent;
  let fixture: ComponentFixture<TaskletMeetingMinutesFragmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TimelineImports],
      declarations: [TimelineDeclarations],
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
