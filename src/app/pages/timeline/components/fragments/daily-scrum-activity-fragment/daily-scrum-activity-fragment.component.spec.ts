import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {DailyScrumActivityFragmentComponent} from './daily-scrum-activity-fragment.component';

describe('DailyScrumActivityFragmentComponent', () => {
  let component: DailyScrumActivityFragmentComponent;
  let fixture: ComponentFixture<DailyScrumActivityFragmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DailyScrumActivityFragmentComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DailyScrumActivityFragmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
