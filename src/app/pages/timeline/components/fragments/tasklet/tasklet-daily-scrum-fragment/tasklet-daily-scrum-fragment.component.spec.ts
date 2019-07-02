import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {TaskletDailyScrumFragmentComponent} from './tasklet-daily-scrum-fragment.component';
import {TimelineImports} from '../../../../timeline.imports';
import {TimelineDeclarations} from '../../../../timeline.declaration';

describe('TaskletDailyScrumFragmentComponent', () => {
  let component: TaskletDailyScrumFragmentComponent;
  let fixture: ComponentFixture<TaskletDailyScrumFragmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TimelineImports],
      declarations: [TimelineDeclarations],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskletDailyScrumFragmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
