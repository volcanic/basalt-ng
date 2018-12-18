import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskTooltipContainerComponent } from './task-tooltip-container.component';

describe('TaskTooltipContainerComponent', () => {
  let component: TaskTooltipContainerComponent;
  let fixture: ComponentFixture<TaskTooltipContainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TaskTooltipContainerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskTooltipContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
