import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {CheckableListComponent} from './checkable-list.component';
import {CheckableListImports} from '../checkable-list.imports';
import {CheckableListDeclarations} from '../checkable-list.declaration';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

describe('CompletableListComponent', () => {
  let component: CheckableListComponent;
  let fixture: ComponentFixture<CheckableListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [CheckableListImports, BrowserAnimationsModule],
      declarations: [CheckableListDeclarations],
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
