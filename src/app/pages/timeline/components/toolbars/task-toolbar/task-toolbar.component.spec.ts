import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {TaskToolbarComponent} from './task-toolbar.component';
import {TimelineImports} from '../../../timeline.imports';
import {TimelineDeclarations} from '../../../timeline.declaration';

describe('TaskToolbarComponent', () => {
  let component: TaskToolbarComponent;
  let fixture: ComponentFixture<TaskToolbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TimelineImports],
      declarations: [TimelineDeclarations],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskToolbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
