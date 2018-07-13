import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TagChipsFragmentComponent } from './tag-chips-fragment.component';

describe('TagChipsFragmentComponent', () => {
  let component: TagChipsFragmentComponent;
  const fixture: ComponentFixture<TagChipsFragmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TagChipsFragmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TagChipsFragmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
