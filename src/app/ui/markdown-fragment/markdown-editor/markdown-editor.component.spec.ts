import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {MarkdownEditorComponent} from './markdown-editor.component';
import {MarkdownFragmentImports} from '../markdown-fragment.imports';
import {MarkdownFragmentDeclarations} from '../markdown-fragment.declaration';

describe('MarkdownEditorComponent', () => {
  let component: MarkdownEditorComponent;
  let fixture: ComponentFixture<MarkdownEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [MarkdownFragmentImports],
      declarations: [MarkdownFragmentDeclarations],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MarkdownEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
