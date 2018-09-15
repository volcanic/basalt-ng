import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {FilterTagListComponent} from './filter-tag-list.component';

describe('FilterTagListComponent', () => {
  let component: FilterTagListComponent;
  let fixture: ComponentFixture<FilterTagListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FilterTagListComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FilterTagListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
