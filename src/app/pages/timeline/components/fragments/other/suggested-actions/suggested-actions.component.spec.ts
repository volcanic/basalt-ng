import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SuggestedActionsComponent } from './suggested-actions.component';

describe('SuggestedActionsComponent', () => {
  let component: SuggestedActionsComponent;
  let fixture: ComponentFixture<SuggestedActionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SuggestedActionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SuggestedActionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
