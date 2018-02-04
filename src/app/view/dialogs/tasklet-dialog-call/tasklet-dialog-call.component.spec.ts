import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskletDialogCallComponent } from './tasklet-dialog-call.component';

describe('TaskletDialogCallComponent', () => {
  let component: TaskletDialogCallComponent;
  let fixture: ComponentFixture<TaskletDialogCallComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TaskletDialogCallComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskletDialogCallComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
