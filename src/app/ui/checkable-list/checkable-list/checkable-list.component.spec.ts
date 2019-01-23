import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckableListComponent } from './checkable-list.component';

describe('CompletableListComponent', () => {
  let component: CheckableListComponent;
  let fixture: ComponentFixture<CheckableListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CheckableListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckableListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
