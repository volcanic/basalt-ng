import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {PersonChipsFragmentComponent} from './person-chips-fragment.component';

describe('PersonChipsFragmentComponent', () => {
  let component: PersonChipsFragmentComponent;
  let fixture: ComponentFixture<PersonChipsFragmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PersonChipsFragmentComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonChipsFragmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
