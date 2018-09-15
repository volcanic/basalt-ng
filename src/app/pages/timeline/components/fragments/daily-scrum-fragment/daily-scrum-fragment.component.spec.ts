import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {DailyScrumFragmentComponent} from './daily-scrum-fragment.component';

describe('DailyScrumFragmentComponent', () => {
  let component: DailyScrumFragmentComponent;
  let fixture: ComponentFixture<DailyScrumFragmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DailyScrumFragmentComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DailyScrumFragmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
