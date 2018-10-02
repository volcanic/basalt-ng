import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {TaskletDailyScrumFragmentComponent} from './tasklet-daily-scrum-fragment.component';

describe('TaskletDailyScrumFragmentComponent', () => {
  let component: TaskletDailyScrumFragmentComponent;
  let fixture: ComponentFixture<TaskletDailyScrumFragmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TaskletDailyScrumFragmentComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskletDailyScrumFragmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
