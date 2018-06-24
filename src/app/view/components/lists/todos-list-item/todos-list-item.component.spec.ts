import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TodosListItemComponent } from './todos-list-item.component';

describe('TodosListItemComponent', () => {
  let component: TodosListItemComponent;
  let fixture: ComponentFixture<TodosListItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TodosListItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TodosListItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
