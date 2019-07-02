import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {TaskAutocompleteFragmentComponent} from './task-autocomplete-fragment.component';
import {TaskAutocompleteImports} from '../task-autocomplete.imports';
import {TaskAutocompleteDeclarations} from '../task-autocomplete.declaration';

describe('TaskAutocompleteFragmentComponent', () => {
  let component: TaskAutocompleteFragmentComponent;
  let fixture: ComponentFixture<TaskAutocompleteFragmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TaskAutocompleteImports],
      declarations: [TaskAutocompleteDeclarations]
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
