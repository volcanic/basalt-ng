import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Description} from 'app/core/entity/model/description.model';
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
      } catch (__) {}
    }

    return ''; // use external default escaping
  }
});

/**
 * Displays description fragment
 */
@Component({
  selector: 'app-description-fragment',
  templateUrl: './description-fragment.component.html',
  styleUrls: ['./description-fragment.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DescriptionFragmentComponent implements OnInit {

  /** Description of to be displayed */
  @Input() description: Description = new Description();
  /** Placeholder to be used */
  @Input() placeholder = '';
  /** Whether component is readonly or not */
  @Input() readonly = false;
  /** */
  @Input() markdownText = '';
  /** Event emitter indicating changes in description */
  @Output() descriptionChangedEmitter = new EventEmitter<Description>();

  ngOnInit(): void {
    this.updateMarkdown();
  }

  //
  // Actions
  //

  /**
   * Handles click on clear button
   */
  onClearButtonClicked() {
    this.description.value = '';
  }

  /**
   * Handles changes in description text
   */
  onDescriptionTextChanged() {
    this.updateMarkdown();
    this.descriptionChangedEmitter.emit(this.description);
  }

  /**
   * Updates markdown
   */
  updateMarkdown() {
    this.markdownText = md.render(this.description.value);
  }

}
