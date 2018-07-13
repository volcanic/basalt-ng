import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskletComponent } from './tasklet.component';

describe('TaskletWeeklyDigestComponent', () => {
  let component: TaskletComponent;
  const fixture: ComponentFixture<TaskletComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TaskletComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskletComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
