import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {CompletableListItemComponent} from './completable-list-item.component';
import {CheckableListDeclarations} from '../checkable-list.declaration';
import {CheckableListImports} from '../checkable-list.imports';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

describe('CompletableListItemComponent', () => {
  let component: CompletableListItemComponent;
  let fixture: ComponentFixture<CompletableListItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [CheckableListImports, BrowserAnimationsModule],
      declarations: [CheckableListDeclarations],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompletableListItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
