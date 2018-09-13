import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Tag} from '../../../model/entities/tag.model';
import {Action} from '../../../model/ui/action.enum';

/**
 * Displays tag list item
 */
@Component({
  selector: 'app-filter-tag-list-item',
  templateUrl: './filter-tag-list-item.component.html',
  styleUrls: ['./filter-tag-list-item.component.scss']
})
export class FilterTagListItemComponent {

  /** Tag to be displayed */
  @Input() tag: Tag;
  /** Event emitter indicating tag action */
  @Output() tagEventEmitter = new EventEmitter<{ action: Action, tags: Tag[] }>();

  //
  // Actions
  //

  /**
   * Handles (un-)selecting a tag
   */
  onTagChanged(tag: Tag) {
    this.tagEventEmitter.emit({action: Action.FILTER_LIST, tags: [tag]});
  }
}
