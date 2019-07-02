import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {TaskletMeetingMinuteItemFragmentComponent} from './tasklet-meeting-minute-item-fragment.component';
import {TimelineImports} from '../../../../timeline.imports';
import {TimelineDeclarations} from '../../../../timeline.declaration';

describe('TaskletDailyScrumItemFragmentComponent', () => {
  let component: TaskletMeetingMinuteItemFragmentComponent;
  let fixture: ComponentFixture<TaskletMeetingMinuteItemFragmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TimelineImports],
      declarations: [TimelineDeclarations],
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
