import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EffortPickerFragmentComponent } from './effort-picker-fragment.component';

describe('EffortPickerFragmentComponent', () => {
  let component: EffortPickerFragmentComponent;
  let fixture: ComponentFixture<EffortPickerFragmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EffortPickerFragmentComponent ]
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
