import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {SuggestedActionButtonComponent} from './suggested-action-button.component';
import {SuggestedActionButtonImports} from '../suggested-action-button.imports';
import {SuggestedActionButtonDeclarations} from '../suggested-action-button.declaration';

describe('SuggestedActionButtonComponent', () => {
  let component: SuggestedActionButtonComponent;
  let fixture: ComponentFixture<SuggestedActionButtonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SuggestedActionButtonImports],
      declarations: [SuggestedActionButtonDeclarations]
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
