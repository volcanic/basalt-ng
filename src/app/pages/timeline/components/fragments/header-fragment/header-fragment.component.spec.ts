import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {HeaderFragmentComponent} from './header-fragment.component';

describe('HeaderFragmentComponent', () => {
  let component: HeaderFragmentComponent;
  let fixture: ComponentFixture<HeaderFragmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [HeaderFragmentComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderFragmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
