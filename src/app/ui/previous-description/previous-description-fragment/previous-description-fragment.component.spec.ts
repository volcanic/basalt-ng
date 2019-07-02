import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {PreviousDescriptionFragmentComponent} from './previous-description-fragment.component';
import {PreviousDescriptionImports} from '../previous-description.imports';
import {PreviousDescriptionDeclarations} from '../previous-description.declaration';

describe('PreviousDescriptionFragmentComponent', () => {
  let component: PreviousDescriptionFragmentComponent;
  let fixture: ComponentFixture<PreviousDescriptionFragmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [PreviousDescriptionImports],
      declarations: [PreviousDescriptionDeclarations],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreviousDescriptionFragmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
