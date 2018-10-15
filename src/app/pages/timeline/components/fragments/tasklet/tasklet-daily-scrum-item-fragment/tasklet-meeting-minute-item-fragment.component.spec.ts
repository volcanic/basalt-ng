import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskletDailyScrumItemFragmentComponent } from './tasklet-daily-scrum-item-fragment.component';

describe('TaskletDailyScrumItemFragmentComponent', () => {
  let component: TaskletDailyScrumItemFragmentComponent;
  let fixture: ComponentFixture<TaskletDailyScrumItemFragmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TaskletDailyScrumItemFragmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskletDailyScrumItemFragmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
