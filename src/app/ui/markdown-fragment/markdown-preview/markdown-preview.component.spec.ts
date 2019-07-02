import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {MarkdownPreviewComponent} from './markdown-preview.component';
import {MarkdownFragmentImports} from '../markdown-fragment.imports';
import {MarkdownFragmentDeclarations} from '../markdown-fragment.declaration';

describe('MarkdownPreviewComponent', () => {
  let component: MarkdownPreviewComponent;
  let fixture: ComponentFixture<MarkdownPreviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [MarkdownFragmentImports],
      declarations: [MarkdownFragmentDeclarations],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MarkdownPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
