import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ProjectPickerFragmentComponent} from './project-picker-fragment.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ProjectPickerImports} from '../project-picker.imports';
import {ProjectPickerDeclarations} from '../project-picker.declaration';

describe('ProjectPickerFragmentComponent', () => {
  let component: ProjectPickerFragmentComponent;
  let fixture: ComponentFixture<ProjectPickerFragmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ProjectPickerImports, BrowserAnimationsModule],
      declarations: [ProjectPickerDeclarations],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectPickerFragmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
