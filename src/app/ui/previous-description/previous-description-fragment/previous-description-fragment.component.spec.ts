import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {PreviousDescriptionFragmentComponent} from './previous-description-fragment.component';

describe('PreviousDescriptionFragmentComponent', () => {
  let component: PreviousDescriptionFragmentComponent;
  let fixture: ComponentFixture<PreviousDescriptionFragmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PreviousDescriptionFragmentComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreviousDescriptionFragmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
