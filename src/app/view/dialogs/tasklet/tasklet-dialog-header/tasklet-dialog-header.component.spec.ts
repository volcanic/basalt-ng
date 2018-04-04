import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskletDialogHeaderComponent } from './tasklet-dialog-header.component';

describe('TaskletDialogHeaderComponent', () => {
  let component: TaskletDialogHeaderComponent;
  let fixture: ComponentFixture<TaskletDialogHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TaskletDialogHeaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskletDialogHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
