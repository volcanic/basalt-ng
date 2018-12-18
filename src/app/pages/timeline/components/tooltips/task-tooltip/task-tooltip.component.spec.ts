import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskTooltipComponent } from './task-tooltip.component';

describe('TaskTooltipComponent', () => {
  let component: TaskTooltipComponent;
  let fixture: ComponentFixture<TaskTooltipComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TaskTooltipComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskTooltipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
