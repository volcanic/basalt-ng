import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ProjectAutocompleteFragmentComponent} from './project-autocomplete-fragment.component';
import {TimelineImports} from '../../../../timeline.imports';
import {TimelineDeclarations} from '../../../../timeline.declaration';

describe('ProjectAutocompleteFragmentComponent', () => {
  let component: ProjectAutocompleteFragmentComponent;
  let fixture: ComponentFixture<ProjectAutocompleteFragmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TimelineImports],
      declarations: [TimelineDeclarations],
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
