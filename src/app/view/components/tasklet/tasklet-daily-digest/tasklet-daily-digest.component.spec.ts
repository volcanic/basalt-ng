import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskletDailyDigestComponent } from './tasklet-daily-digest.component';

describe('TaskletDailyDigestComponent', () => {
  let component: TaskletDailyDigestComponent;
  const fixture: ComponentFixture<TaskletDailyDigestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TaskletDailyDigestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskletDailyDigestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
