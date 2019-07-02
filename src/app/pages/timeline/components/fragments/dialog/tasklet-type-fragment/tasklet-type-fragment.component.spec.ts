import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {TaskletTypeFragmentComponent} from './tasklet-type-fragment.component';
import {TimelineImports} from '../../../../timeline.imports';
import {TimelineDeclarations} from '../../../../timeline.declaration';

describe('RecurrenceIntervalFragmentComponent', () => {
  let component: TaskletTypeFragmentComponent;
  let fixture: ComponentFixture<TaskletTypeFragmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TimelineImports],
      declarations: [TimelineDeclarations],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskletTypeFragmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
