import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {TaskletsToolbarComponent} from './tasklets-toolbar.component';

describe('TaskletsToolbarComponent', () => {
  let component: TaskletsToolbarComponent;
  let fixture: ComponentFixture<TaskletsToolbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TaskletsToolbarComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskletsToolbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
