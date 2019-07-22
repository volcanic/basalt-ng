import {ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import hljs from 'highlight.js';

/**
 * Markdown converter instance including configuration
 */
const md = require('markdown-it')({
  html: true,
  linkify: true,
  typographer: true,
  highlight(str, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return hljs.highlight(lang, str).value;
      } catch (__) {
      }
    }

    return ''; // use external default escaping
  }
});

/**
 * Default renderer for markdown
 */
// tslint:disable-next-line:only-arrow-functions
const defaultRender = md.renderer.rules.link_open || function(tokens, idx, options, env, self) {
  return self.renderToken(tokens, idx, options);
};

/**
 * Adds configuration for links
 * @param tokens tokens
 * @param idx idx
 * @param options options
 * @param env env
 * @param self self
 */
// tslint:disable-next-line:only-arrow-functions
md.renderer.rules.link_open = function(tokens, idx, options, env, self) {
  // If you are sure other plugins can't add `target` - drop check below
  const aIndex = tokens[idx].attrIndex('target');

  if (aIndex < 0) {
    tokens[idx].attrPush(['target', '_blank']); // add new attribute
  } else {
    tokens[idx].attrs[aIndex][1] = '_blank';    // replace value of existing attr
  }

  // Pass token to default renderer.
  return defaultRender(tokens, idx, options, env, self);
};

/**
 * Displays rendered markdown text
 */
@Component({
  selector: 'app-markdown-preview',
  templateUrl: './markdown-preview.component.html',
  styleUrls: ['./markdown-preview.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MarkdownPreviewComponent implements OnChanges {

  /** Text to be formatted */
  @Input() markdownText = '';
  /** Prevents paragraph margin if true */
  @Input() preventParagraphMargins = false;

  /** Text transformed into html */
  htmlText = '';

  //
  // Lifecycle hooks
  //

  /**
   * Handles on-change lifecycle phase
   * @param changes simple changes
   */
  ngOnChanges(changes: SimpleChanges) {
    this.updateMarkdown();
  }

  //
  // Actions
  //

  /**
   * Updates markdown
   */
  updateMarkdown() {
    if (this.markdownText != null) {
      this.htmlText = md.render(this.markdownText.replace(new RegExp('\n', 'g'), '<br/>'));
    }
  }
}
