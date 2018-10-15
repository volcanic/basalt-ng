import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SuggestedActionButtonComponent } from './suggested-action-button.component';

describe('SuggestedActionButtonComponent', () => {
  let component: SuggestedActionButtonComponent;
  let fixture: ComponentFixture<SuggestedActionButtonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SuggestedActionButtonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SuggestedActionButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
