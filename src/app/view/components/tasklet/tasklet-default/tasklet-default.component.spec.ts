import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskletDefaultComponent } from './tasklet-default.component';

describe('TaskletDefaultComponent', () => {
  let component: TaskletDefaultComponent;
  let fixture: ComponentFixture<TaskletDefaultComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TaskletDefaultComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskletDefaultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
