import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ProjectAutocompleteFragmentComponent} from './project-autocomplete-fragment.component';

describe('ProjectAutocompleteFragmentComponent', () => {
  let component: ProjectAutocompleteFragmentComponent;
  let fixture: ComponentFixture<ProjectAutocompleteFragmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ProjectAutocompleteFragmentComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectAutocompleteFragmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
