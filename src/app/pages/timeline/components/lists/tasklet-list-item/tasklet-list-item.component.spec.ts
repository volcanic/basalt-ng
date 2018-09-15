import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {TaskletListItemComponent} from './tasklet-list-item.component';

describe('TaskletListItemComponent', () => {
  let component: TaskletListItemComponent;
  let fixture: ComponentFixture<TaskletListItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TaskletListItemComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskletListItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
