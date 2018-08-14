import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {PersonFilterDialogComponent} from './person-filter-dialog.component';

describe('PersonFilterDialogComponent', () => {
  let component: PersonFilterDialogComponent;
  let fixture: ComponentFixture<PersonFilterDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PersonFilterDialogComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonFilterDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
