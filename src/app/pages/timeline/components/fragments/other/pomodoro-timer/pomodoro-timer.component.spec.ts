import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {PomodoroTimerComponent} from './pomodoro-timer.component';
import {TimelineImports} from '../../../../timeline.imports';
import {TimelineDeclarations} from '../../../../timeline.declaration';

describe('PomodoroTimerComponent', () => {
  let component: PomodoroTimerComponent;
  let fixture: ComponentFixture<PomodoroTimerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TimelineImports],
      declarations: [TimelineDeclarations],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PomodoroTimerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
