import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskletDialogTagsComponent } from './tasklet-dialog-tags.component';

describe('TaskletDialogTagsComponent', () => {
  let component: TaskletDialogTagsComponent;
  let fixture: ComponentFixture<TaskletDialogTagsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TaskletDialogTagsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskletDialogTagsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
