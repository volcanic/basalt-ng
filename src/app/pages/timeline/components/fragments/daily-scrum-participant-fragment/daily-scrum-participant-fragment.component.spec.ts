import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {DailyScrumParticipantFragmentComponent} from './daily-scrum-participant-fragment.component';

describe('DailyScrumParticipantFragmentComponent', () => {
  let component: DailyScrumParticipantFragmentComponent;
  let fixture: ComponentFixture<DailyScrumParticipantFragmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DailyScrumParticipantFragmentComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DailyScrumParticipantFragmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
