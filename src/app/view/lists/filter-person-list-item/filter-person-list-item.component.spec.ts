import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {FilterPersonListItemComponent} from './filter-person-list-item.component';

describe('FilterPersonListItemComponent', () => {
  let component: FilterPersonListItemComponent;
  let fixture: ComponentFixture<FilterPersonListItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FilterPersonListItemComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FilterPersonListItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
