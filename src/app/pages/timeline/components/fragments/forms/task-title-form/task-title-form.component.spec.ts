import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {TaskTitleFormComponent} from './task-title-form.component';

describe('TaskTitleFormComponent', () => {
  let component: TaskTitleFormComponent;
  let fixture: ComponentFixture<TaskTitleFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TaskTitleFormComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskTitleFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
