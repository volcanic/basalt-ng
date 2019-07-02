import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {EffortPickerFragmentComponent} from './effort-picker-fragment.component';
import {EffortPickerFragmentImports} from '../effort-picker-fragment.imports';
import {EffortPickerDeclarations} from '../effort-picker-fragment.declaration';

describe('EffortPickerFragmentComponent', () => {
  let component: EffortPickerFragmentComponent;
  let fixture: ComponentFixture<EffortPickerFragmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [EffortPickerFragmentImports],
      declarations: [EffortPickerDeclarations],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EffortPickerFragmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
