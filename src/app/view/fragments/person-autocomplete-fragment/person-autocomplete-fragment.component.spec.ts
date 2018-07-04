import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {PersonAutocompleteFragmentComponent} from './person-autocomplete-fragment.component';

describe('PersonAutocompleteFragmentComponent', () => {
  let component: PersonAutocompleteFragmentComponent;
  let fixture: ComponentFixture<PersonAutocompleteFragmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PersonAutocompleteFragmentComponent]
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
