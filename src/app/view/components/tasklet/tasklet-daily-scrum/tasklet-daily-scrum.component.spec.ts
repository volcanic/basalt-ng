import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {TaskletDailyScrumComponent} from './tasklet-daily-scrum.component';

describe('TaskletDailyScrumComponent', () => {
  let component: TaskletDailyScrumComponent;
  let fixture: ComponentFixture<TaskletDailyScrumComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TaskletDailyScrumComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskletDailyScrumComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
