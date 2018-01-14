import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskletTodoComponent } from './tasklet-todo.component';

describe('TaskletTodoComponent', () => {
  let component: TaskletTodoComponent;
  let fixture: ComponentFixture<TaskletTodoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TaskletTodoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskletTodoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
