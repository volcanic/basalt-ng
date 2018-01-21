import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TodosSideMenuStartComponent } from './todos-side-menu-start.component';

describe('TodosSideMenuStartComponent', () => {
  let component: TodosSideMenuStartComponent;
  let fixture: ComponentFixture<TodosSideMenuStartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TodosSideMenuStartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TodosSideMenuStartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
