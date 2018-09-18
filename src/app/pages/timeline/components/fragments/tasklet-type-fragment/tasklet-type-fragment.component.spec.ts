import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {TaskletTypeFragmentComponent} from './tasklet-type-fragment.component';

describe('RecurrenceIntervalFragmentComponent', () => {
  let component: TaskletTypeFragmentComponent;
  let fixture: ComponentFixture<TaskletTypeFragmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TaskletTypeFragmentComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskletTypeFragmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
