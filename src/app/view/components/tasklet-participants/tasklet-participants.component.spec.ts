import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {TaskletParticipantsComponent} from './tasklet-participants.component';

describe('TaskletParticipantsComponent', () => {
  let component: TaskletParticipantsComponent;
  let fixture: ComponentFixture<TaskletParticipantsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TaskletParticipantsComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskletParticipantsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
