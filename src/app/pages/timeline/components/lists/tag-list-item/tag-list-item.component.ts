import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';
import {Tag} from 'app/core/entity/model/tag.model';
import {Action} from 'app/core/entity/model/action.enum';

/**
 * Displays tag list item
 */
@Component({
  selector: 'app-tag-list-item',
  templateUrl: './tag-list-item.component.html',
  styleUrls: ['./tag-list-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TagListItemComponent {

  /** Tag to be displayed */
  @Input() tag: Tag;
  /** Event emitter indicating tag action */
  @Output() tagEventEmitter = new EventEmitter<{ action: Action, tag: Tag }>();

  /** Animation state */
  state = 'inactive';

  //
  // Actions
  //

  /**
   * Handles click on tag
   */
  onTagClicked() {
    this.tagEventEmitter.emit({action: Action.OPEN_DIALOG_UPDATE, tag: this.tag})
  }

  /**
   * Handles hover over container
   * @param {boolean} hovered whether there is currently a hover event
   */
  onHoverContainer(hovered: boolean) {
    this.state = hovered ? 'active' : 'inactive';
  }
}
