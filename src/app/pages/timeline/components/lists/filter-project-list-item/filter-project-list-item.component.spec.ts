import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {FilterProjectListItemComponent} from './filter-project-list-item.component';

describe('FilterProjectListItemComponent', () => {
  let component: FilterProjectListItemComponent;
  let fixture: ComponentFixture<FilterProjectListItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FilterProjectListItemComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FilterProjectListItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
