import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MeetingMinutesFragmentComponent } from './meeting-minutes-fragment.component';

describe('MeetingMinutesFragmentComponent', () => {
  let component: MeetingMinutesFragmentComponent;
  let fixture: ComponentFixture<MeetingMinutesFragmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MeetingMinutesFragmentComponent ]
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
