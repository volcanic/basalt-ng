import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ColorPopoverComponent} from './color-popover.component';
import {TimelineImports} from '../../../timeline.imports';
import {TimelineDeclarations} from '../../../timeline.declaration';

describe('ColorPopoverComponent', () => {
  let component: ColorPopoverComponent;
  let fixture: ComponentFixture<ColorPopoverComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TimelineImports],
      declarations: [TimelineDeclarations],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ColorPopoverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
