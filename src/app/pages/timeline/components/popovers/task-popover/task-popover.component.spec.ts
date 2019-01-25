import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskPopoverComponent } from './task-popover.component';

describe('TaskPopoverComponent', () => {
  let component: TaskPopoverComponent;
  let fixture: ComponentFixture<TaskPopoverComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TaskPopoverComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskPopoverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
