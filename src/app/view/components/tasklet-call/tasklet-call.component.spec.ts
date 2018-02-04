import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {TaskletCallComponent} from './tasklet-call.component';

describe('TaskletCallComponent', () => {
  let component: TaskletCallComponent;
  let fixture: ComponentFixture<TaskletCallComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TaskletCallComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskletCallComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
