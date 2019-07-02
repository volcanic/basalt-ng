import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {PersonIndicatorButtonComponent} from './person-indicator-button.component';
import {PersonIndicatorButtonImports} from '../person-indicator-button.imports';
import {PersonIndicatorButtonDeclarations} from '../person-indicator-button.declaration';

describe('PersonIndicatorButtonComponent', () => {
  let component: PersonIndicatorButtonComponent;
  let fixture: ComponentFixture<PersonIndicatorButtonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [PersonIndicatorButtonImports],
      declarations: [PersonIndicatorButtonDeclarations],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonIndicatorButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
