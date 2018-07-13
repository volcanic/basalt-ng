import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DescriptionFragmentComponent } from './description-fragment.component';

describe('DescriptionFragmentComponent', () => {
  let component: DescriptionFragmentComponent;
  const fixture: ComponentFixture<DescriptionFragmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DescriptionFragmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DescriptionFragmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
