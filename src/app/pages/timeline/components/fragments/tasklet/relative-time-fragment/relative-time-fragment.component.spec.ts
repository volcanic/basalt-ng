import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RelativeTimeFragmentComponent } from './relative-time-fragment.component';

describe('RelativeTimeFragmentComponent', () => {
  let component: RelativeTimeFragmentComponent;
  let fixture: ComponentFixture<RelativeTimeFragmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RelativeTimeFragmentComponent ]
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
