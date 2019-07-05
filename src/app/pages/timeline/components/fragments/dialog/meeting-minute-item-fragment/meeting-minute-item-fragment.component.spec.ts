import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {MeetingMinuteItemFragmentComponent} from './meeting-minute-item-fragment.component';
import {TimelineImports} from '../../../../timeline.imports';
import {TimelineDeclarations} from '../../../../timeline.declaration';

jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;

describe('MeetingMinuteItemFragmentComponent', () => {
  let component: MeetingMinuteItemFragmentComponent;
  let fixture: ComponentFixture<MeetingMinuteItemFragmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TimelineImports],
      declarations: [TimelineDeclarations],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MeetingMinuteItemFragmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
