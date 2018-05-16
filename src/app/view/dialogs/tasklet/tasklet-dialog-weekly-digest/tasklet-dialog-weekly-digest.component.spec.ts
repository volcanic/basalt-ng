import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskletDialogWeeklyDigestComponent } from './tasklet-dialog-weekly-digest.component';

describe('TaskletDialogWeeklyDigestComponent', () => {
  let component: TaskletDialogWeeklyDigestComponent;
  let fixture: ComponentFixture<TaskletDialogWeeklyDigestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TaskletDialogWeeklyDigestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskletDialogWeeklyDigestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
