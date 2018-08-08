import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {FilterProjectListComponent} from './filter-project-list.component';

describe('FilterProjectListComponent', () => {
  let component: FilterProjectListComponent;
  let fixture: ComponentFixture<FilterProjectListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FilterProjectListComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FilterProjectListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
