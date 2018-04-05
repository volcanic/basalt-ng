import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {TaskletDialogContentComponent} from './tasklet-dialog-content.component';

describe('TaskletDialogContentComponent', () => {
  let component: TaskletDialogContentComponent;
  let fixture: ComponentFixture<TaskletDialogContentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TaskletDialogContentComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskletDialogContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
