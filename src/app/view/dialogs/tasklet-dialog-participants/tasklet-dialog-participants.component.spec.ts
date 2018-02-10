import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {TaskletDialogParticipantComponent} from './tasklet-dialog-participants.component';

describe('TaskletDialogParticipantComponent', () => {
  let component: TaskletDialogParticipantComponent;
  let fixture: ComponentFixture<TaskletDialogParticipantComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TaskletDialogParticipantComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskletDialogParticipantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
