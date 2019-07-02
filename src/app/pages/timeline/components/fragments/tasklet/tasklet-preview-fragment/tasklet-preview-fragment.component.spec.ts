import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {TaskletPreviewFragmentComponent} from './tasklet-preview-fragment.component';
import {TimelineImports} from '../../../../timeline.imports';
import {TimelineDeclarations} from '../../../../timeline.declaration';

describe('TaskletPreviewFragmentComponent', () => {
  let component: TaskletPreviewFragmentComponent;
  let fixture: ComponentFixture<TaskletPreviewFragmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TimelineImports],
      declarations: [TimelineDeclarations],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskletPreviewFragmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
