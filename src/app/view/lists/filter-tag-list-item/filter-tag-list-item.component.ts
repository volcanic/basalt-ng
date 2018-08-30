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
  @Output() tagEventEmitter = new EventEmitter<{ action: Action, list: Tag[], none: boolean }>();

  /** Enum for action types */
  action = Action;
  /** Animation state */
  state = 'inactive';

  //
  // Actions
  //

  /**
   * Handles hover over container
   * @param {boolean} hovered whether there is currently a hover event
   */
  onHoverContainer(hovered: boolean) {
    this.state = hovered ? 'active' : 'inactive';
  }
}
