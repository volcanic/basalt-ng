import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {FilterPersonListComponent} from './filter-person-list.component';

describe('FilterPersonListComponent', () => {
  let component: FilterPersonListComponent;
  let fixture: ComponentFixture<FilterPersonListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FilterPersonListComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FilterPersonListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
