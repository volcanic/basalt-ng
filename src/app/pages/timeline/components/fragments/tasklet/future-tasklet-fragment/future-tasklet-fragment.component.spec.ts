import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FutureTaskletFragmentComponent } from './future-tasklet-fragment.component';

describe('FutureTaskletFragmentComponent', () => {
  let component: FutureTaskletFragmentComponent;
  let fixture: ComponentFixture<FutureTaskletFragmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FutureTaskletFragmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FutureTaskletFragmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
