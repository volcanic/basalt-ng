import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ColorPickerComponent} from './color-picker.component';
import {ColorPickerDeclarations} from '../color-picker.declarations';
import {ColorPickerImports} from '../color-picker.imports';

describe('ColorPickerComponent', () => {
  let component: ColorPickerComponent;
  let fixture: ComponentFixture<ColorPickerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ColorPickerDeclarations],
      imports: [ColorPickerImports]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ColorPickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
