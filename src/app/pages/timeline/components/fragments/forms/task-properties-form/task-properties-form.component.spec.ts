import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskPropertiesFormComponent } from './task-properties-form.component';

describe('TaskPropertiesFormComponent', () => {
  let component: TaskPropertiesFormComponent;
  let fixture: ComponentFixture<TaskPropertiesFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TaskPropertiesFormComponent ]
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
