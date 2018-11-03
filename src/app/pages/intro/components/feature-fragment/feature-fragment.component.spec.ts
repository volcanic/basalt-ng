import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {FeatureFragmentComponent} from './feature-fragment.component';

describe('RecurrenceIntervalFragmentComponent', () => {
  let component: FeatureFragmentComponent;
  let fixture: ComponentFixture<FeatureFragmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FeatureFragmentComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FeatureFragmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
