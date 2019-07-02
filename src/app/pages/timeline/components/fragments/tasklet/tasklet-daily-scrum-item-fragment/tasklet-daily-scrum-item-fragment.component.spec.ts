import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {TaskletDailyScrumItemFragmentComponent} from './tasklet-daily-scrum-item-fragment.component';
import {TimelineImports} from '../../../../timeline.imports';
import {TimelineDeclarations} from '../../../../timeline.declaration';

describe('TaskletDailyScrumItemFragmentComponent', () => {
  let component: TaskletDailyScrumItemFragmentComponent;
  let fixture: ComponentFixture<TaskletDailyScrumItemFragmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TimelineImports],
      declarations: [TimelineDeclarations],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskletDailyScrumItemFragmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
