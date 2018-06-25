import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { taskListComponent } from './task-list.component';

describe('taskListComponent', () => {
  let component: taskListComponent;
  let fixture: ComponentFixture<taskListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ taskListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(taskListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
