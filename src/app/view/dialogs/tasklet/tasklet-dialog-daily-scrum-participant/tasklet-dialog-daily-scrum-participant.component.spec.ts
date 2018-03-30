import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskletDialogDailyScrumParticipantComponent } from './tasklet-dialog-daily-scrum-participant.component';

describe('TaskletDialogDailyScrumParticipantComponent', () => {
  let component: TaskletDialogDailyScrumParticipantComponent;
  let fixture: ComponentFixture<TaskletDialogDailyScrumParticipantComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TaskletDialogDailyScrumParticipantComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskletDialogDailyScrumParticipantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
