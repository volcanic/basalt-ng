import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {RelativeTimeFragmentComponent} from './relative-time-fragment.component';
import {TimelineImports} from '../../../../timeline.imports';
import {TimelineDeclarations} from '../../../../timeline.declaration';

describe('RelativeTimeFragmentComponent', () => {
  let component: RelativeTimeFragmentComponent;
  let fixture: ComponentFixture<RelativeTimeFragmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TimelineImports],
      declarations: [TimelineDeclarations],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RelativeTimeFragmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
