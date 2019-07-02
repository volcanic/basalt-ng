import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {PersonAutocompleteFragmentComponent} from './person-autocomplete-fragment.component';
import {TimelineImports} from '../../../../timeline.imports';
import {TimelineDeclarations} from '../../../../timeline.declaration';

describe('PersonAutocompleteFragmentComponent', () => {
  let component: PersonAutocompleteFragmentComponent;
  let fixture: ComponentFixture<PersonAutocompleteFragmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TimelineImports],
      declarations: [TimelineDeclarations],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonAutocompleteFragmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
