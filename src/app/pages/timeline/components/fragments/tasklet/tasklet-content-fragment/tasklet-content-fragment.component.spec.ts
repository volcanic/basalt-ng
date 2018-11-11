import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskletContentFragmentComponent } from './tasklet-content-fragment.component';

describe('TaskletContentFragmentComponent', () => {
  let component: TaskletContentFragmentComponent;
  let fixture: ComponentFixture<TaskletContentFragmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TaskletContentFragmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskletContentFragmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
