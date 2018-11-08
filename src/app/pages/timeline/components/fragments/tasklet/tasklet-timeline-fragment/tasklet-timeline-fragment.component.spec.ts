import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskletTimelineFragmentComponent } from './tasklet-timeline-fragment.component';

describe('TaskletTimelineFragmentComponent', () => {
  let component: TaskletTimelineFragmentComponent;
  let fixture: ComponentFixture<TaskletTimelineFragmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TaskletTimelineFragmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskletTimelineFragmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
