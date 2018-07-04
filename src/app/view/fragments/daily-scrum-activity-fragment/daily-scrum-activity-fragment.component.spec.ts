import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {TaskletDialogDailyScrumActivityComponent} from './daily-scrum-activity-fragment.component';

describe('TaskletDialogDailyScrumActivityComponent', () => {
  let component: TaskletDialogDailyScrumActivityComponent;
  let fixture: ComponentFixture<TaskletDialogDailyScrumActivityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TaskletDialogDailyScrumActivityComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskletDialogDailyScrumActivityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
