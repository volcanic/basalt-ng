import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {MarkdownPreviewComponent} from './markdown-preview.component';
import {MarkdownFragmentImports} from '../markdown-fragment.imports';
import {MarkdownFragmentDeclarations} from '../markdown-fragment.declaration';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

describe('MarkdownPreviewComponent', () => {
  let component: MarkdownPreviewComponent;
  let fixture: ComponentFixture<MarkdownPreviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [MarkdownFragmentImports, BrowserAnimationsModule],
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
