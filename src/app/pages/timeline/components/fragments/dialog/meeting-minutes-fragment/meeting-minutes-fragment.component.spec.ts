import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {MeetingMinutesFragmentComponent} from './meeting-minutes-fragment.component';
import {TimelineImports} from '../../../../timeline.imports';
import {TimelineDeclarations} from '../../../../timeline.declaration';

describe('MeetingMinutesFragmentComponent', () => {
  let component: MeetingMinutesFragmentComponent;
  let fixture: ComponentFixture<MeetingMinutesFragmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TimelineImports],
      declarations: [TimelineDeclarations],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MeetingMinutesFragmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
