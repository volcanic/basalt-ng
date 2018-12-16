import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckableListItemComponent } from './checkable-list-item.component';

describe('CheckableListItemComponent', () => {
  let component: CheckableListItemComponent;
  let fixture: ComponentFixture<CheckableListItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CheckableListItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckableListItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
