import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {CheckableListItemComponent} from './checkable-list-item.component';
import {CheckableListImports} from '../checkable-list.imports';
import {CheckableListDeclarations} from '../checkable-list.declaration';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

describe('CompletableListItemComponent', () => {
  let component: CheckableListItemComponent;
  let fixture: ComponentFixture<CheckableListItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [CheckableListImports, BrowserAnimationsModule],
      declarations: [CheckableListDeclarations],
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
