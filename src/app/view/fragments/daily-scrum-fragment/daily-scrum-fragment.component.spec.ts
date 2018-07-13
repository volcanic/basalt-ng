import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {TaskletDialogDailyScrumComponent} from './tasklet-dialog-daily-scrum.component';

describe('TaskletDialogDailyScrumComponent', () => {
  let component: TaskletDialogDailyScrumComponent;
  const fixture: ComponentFixture<TaskletDialogDailyScrumComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TaskletDialogDailyScrumComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskletDialogDailyScrumComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
