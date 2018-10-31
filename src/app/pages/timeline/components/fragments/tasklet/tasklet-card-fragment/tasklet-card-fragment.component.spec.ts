import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskletCardFragmentComponent } from './tasklet-card-fragment.component';

describe('TaskletCardFragmentComponent', () => {
  let component: TaskletCardFragmentComponent;
  let fixture: ComponentFixture<TaskletCardFragmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TaskletCardFragmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskletCardFragmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
