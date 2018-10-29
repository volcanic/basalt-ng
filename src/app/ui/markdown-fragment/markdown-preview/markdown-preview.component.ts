import {ChangeDetectionStrategy, Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import hljs from 'highlight.js';

// Get Markdown-It with all options enabled
const md = require('markdown-it')({
  html: true,
  linkify: true,
  typographer: true,
  highlight: function (str, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return hljs.highlight(lang, str).value;
      } catch (__) {
      }
    }

    return ''; // use external default escaping
  }
});

// Remember old renderer, if overriden, or proxy to default renderer
const defaultRender = md.renderer.rules.link_open || function (tokens, idx, options, env, self) {
  return self.renderToken(tokens, idx, options);
};

md.renderer.rules.link_open = function (tokens, idx, options, env, self) {
  // If you are sure other plugins can't add `target` - drop check below
  const aIndex = tokens[idx].attrIndex('target');

  if (aIndex < 0) {
    tokens[idx].attrPush(['target', '_blank']); // add new attribute
  } else {
    tokens[idx].attrs[aIndex][1] = '_blank';    // replace value of existing attr
  }

  // pass token to default renderer.
  return defaultRender(tokens, idx, options, env, self);
};

@Component({
  selector: 'app-markdown-preview',
  templateUrl: './markdown-preview.component.html',
  styleUrls: ['./markdown-preview.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MarkdownPreviewComponent implements OnChanges {

  /** Text to be formatted */
  @Input() markdownText = '';

  /** Text transformed into html */
  htmlText = '';

  ngOnChanges(changes: SimpleChanges): void {
    this.updateMarkdown();
  }

  /**
   * Updates markdown
   */
  updateMarkdown() {
    this.htmlText = md.render(this.markdownText);
  }
}
