import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {MeetingMinuteItemFragmentComponent} from './meeting-minute-item-fragment.component';

describe('MeetingMinuteItemFragmentComponent', () => {
  let component: MeetingMinuteItemFragmentComponent;
  let fixture: ComponentFixture<MeetingMinuteItemFragmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MeetingMinuteItemFragmentComponent]
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
