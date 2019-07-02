import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {CompletableListComponent} from './completable-list.component';
import {CheckableListImports} from '../checkable-list.imports';
import {CheckableListDeclarations} from '../checkable-list.declaration';

describe('CompletableListComponent', () => {
  let component: CompletableListComponent;
  let fixture: ComponentFixture<CompletableListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [CheckableListImports],
      declarations: [CheckableListDeclarations],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompletableListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
