import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DigestFragmentComponent } from './digest-fragment.component';

describe('DigestFragmentComponent', () => {
  let component: DigestFragmentComponent;
  let fixture: ComponentFixture<DigestFragmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DigestFragmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DigestFragmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
