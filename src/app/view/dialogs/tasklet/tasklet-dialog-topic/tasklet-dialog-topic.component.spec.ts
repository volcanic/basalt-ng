import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskletDialogTopicComponent } from './tasklet-dialog-topic.component';

describe('TaskletDialogTopicComponent', () => {
  let component: TaskletDialogTopicComponent;
  let fixture: ComponentFixture<TaskletDialogTopicComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TaskletDialogTopicComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskletDialogTopicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
