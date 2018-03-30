import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskletDialogTodoComponent } from './tasklet-dialog-todo.component';

describe('TaskletDialogTodoComponent', () => {
  let component: TaskletDialogTodoComponent;
  let fixture: ComponentFixture<TaskletDialogTodoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TaskletDialogTodoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskletDialogTodoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
