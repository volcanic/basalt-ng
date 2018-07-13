import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {TaskListComponent} from './task-list.component';

describe('taskListComponent', () => {
  let component: TaskListComponent;
  const fixture: ComponentFixture<TaskListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TaskListComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
