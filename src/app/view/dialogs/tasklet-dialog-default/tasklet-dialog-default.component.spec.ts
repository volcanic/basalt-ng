import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskletDialogDefaultComponent } from './tasklet-dialog-default.component';

describe('TaskletDialogDefaultComponent', () => {
  let component: TaskletDialogDefaultComponent;
  let fixture: ComponentFixture<TaskletDialogDefaultComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TaskletDialogDefaultComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskletDialogDefaultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
