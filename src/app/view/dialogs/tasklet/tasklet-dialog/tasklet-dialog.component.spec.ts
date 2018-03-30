import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {TaskletDialogComponent} from './tasklet-dialog.component';

describe('TaskletDialogComponent', () => {
  let component: TaskletDialogComponent;
  let fixture: ComponentFixture<TaskletDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TaskletDialogComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskletDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
