import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {TaskAutocompleteFragmentComponent} from './task-autocomplete-fragment.component';

describe('TaskAutocompleteFragmentComponent', () => {
  let component: TaskAutocompleteFragmentComponent;
  let fixture: ComponentFixture<TaskAutocompleteFragmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TaskAutocompleteFragmentComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskAutocompleteFragmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
