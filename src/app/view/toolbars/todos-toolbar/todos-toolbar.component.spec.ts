import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {TodotToolbarComponent} from './todos-toolbar.component';

describe('TodotToolbarComponent', () => {
  let component: TodotToolbarComponent;
  let fixture: ComponentFixture<TodotToolbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TodotToolbarComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TodotToolbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
