import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskletDialogTaskComponent } from './tasklet-dialog-task.component';

describe('TaskletDialogTaskComponent', () => {
  let component: TaskletDialogTaskComponent;
  let fixture: ComponentFixture<TaskletDialogTaskComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TaskletDialogTaskComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskletDialogTaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
