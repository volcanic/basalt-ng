import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskletWeeklyDigestComponent } from './tasklet-weekly-digest.component';

describe('TaskletWeeklyDigestComponent', () => {
  let component: TaskletWeeklyDigestComponent;
  let fixture: ComponentFixture<TaskletWeeklyDigestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TaskletWeeklyDigestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskletWeeklyDigestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
