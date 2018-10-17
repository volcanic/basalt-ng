import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskletComponent } from './tasklet.component';

describe('TaskletComponent', () => {
  let component: TaskletComponent;
  let fixture: ComponentFixture<TaskletComponent>;

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
