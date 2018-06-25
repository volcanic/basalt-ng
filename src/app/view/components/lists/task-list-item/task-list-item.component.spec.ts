import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { taskListItemComponent } from './todos-list-item.component';

describe('taskListItemComponent', () => {
  let component: taskListItemComponent;
  let fixture: ComponentFixture<taskListItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ taskListItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(taskListItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
