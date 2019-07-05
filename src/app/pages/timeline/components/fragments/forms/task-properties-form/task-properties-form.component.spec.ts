import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {TaskPropertiesFormComponent} from './task-properties-form.component';
import {TimelineImports} from '../../../../timeline.imports';
import {TimelineDeclarations} from '../../../../timeline.declaration';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

describe('TaskPropertiesFormComponent', () => {
  let component: TaskPropertiesFormComponent;
  let fixture: ComponentFixture<TaskPropertiesFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TimelineImports, BrowserAnimationsModule],
      declarations: [TimelineDeclarations],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskPropertiesFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
