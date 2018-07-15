import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskletListComponent } from './tasklet-list.component';

describe('TaskletListComponent', () => {
  let component: TaskletListComponent;
  let fixture: ComponentFixture<TaskletListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TaskletListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskletListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
