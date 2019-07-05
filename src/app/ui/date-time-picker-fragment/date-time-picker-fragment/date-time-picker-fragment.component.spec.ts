import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {DateTimePickerFragmentComponent} from './date-time-picker-fragment.component';
import {DateTimePickerFragmentImports} from '../date-time-picker-fragment.imports';
import {DateTimePickerFragmentDeclarations} from '../date-time-picker-fragment.declarations';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

describe('DateTimePickerFragmentComponent', () => {
  let component: DateTimePickerFragmentComponent;
  let fixture: ComponentFixture<DateTimePickerFragmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [DateTimePickerFragmentImports, BrowserAnimationsModule],
      declarations: [DateTimePickerFragmentDeclarations],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DateTimePickerFragmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
