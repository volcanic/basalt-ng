import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {FilterTagListItemComponent} from './filter-tag-list-item.component';

describe('FilterTagListItemComponent', () => {
  let component: FilterTagListItemComponent;
  let fixture: ComponentFixture<FilterTagListItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FilterTagListItemComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FilterTagListItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
