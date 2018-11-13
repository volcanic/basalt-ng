import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {PomodoroFinishedDialogComponent} from './pomodoro-finished-dialog.component';

describe('PomodoroFinishedDialogComponent', () => {
  let component: PomodoroFinishedDialogComponent;
  let fixture: ComponentFixture<PomodoroFinishedDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PomodoroFinishedDialogComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PomodoroFinishedDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
