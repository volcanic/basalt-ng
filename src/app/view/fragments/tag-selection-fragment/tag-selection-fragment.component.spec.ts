import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {TagSelectionFragmentComponent} from './tag-selection-fragment.component';

describe('TagSelectionFragmentComponent', () => {
  let component: TagSelectionFragmentComponent;
  let fixture: ComponentFixture<TagSelectionFragmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TagSelectionFragmentComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TagSelectionFragmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
