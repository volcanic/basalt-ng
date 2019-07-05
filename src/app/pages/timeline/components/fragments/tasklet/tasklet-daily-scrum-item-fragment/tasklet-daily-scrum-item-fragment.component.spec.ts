import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {TaskletDailyScrumItemFragmentComponent} from './tasklet-daily-scrum-item-fragment.component';
import {TimelineImports} from '../../../../timeline.imports';
import {TimelineDeclarations} from '../../../../timeline.declaration';
import {RouterTestingModule} from '@angular/router/testing';
import {NO_ERRORS_SCHEMA} from '@angular/core';

describe('TaskletDailyScrumItemFragmentComponent', () => {
  let component: TaskletDailyScrumItemFragmentComponent;
  let fixture: ComponentFixture<TaskletDailyScrumItemFragmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TimelineImports, RouterTestingModule],
      declarations: [TimelineDeclarations],
      schemas: [NO_ERRORS_SCHEMA]
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
