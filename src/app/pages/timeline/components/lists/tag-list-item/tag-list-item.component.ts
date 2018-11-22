import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output, ViewChild} from '@angular/core';
import {Tag} from 'app/core/entity/model/tag.model';
import {Action} from 'app/core/entity/model/action.enum';
import {Media} from '../../../../../core/ui/model/media.enum';
import {MatMenuTrigger} from '@angular/material';
import {Animations} from './tag-list-item.animation';
import {AnimationState} from '../task-list-item/task-list-item.animation';

/**
 * Displays tag list item
 */
@Component({
  selector: 'app-tag-list-item',
  templateUrl: './tag-list-item.component.html',
  styleUrls: ['./tag-list-item.component.scss'],
  animations: [
    Animations.actionAnimation
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TagListItemComponent  {

  /** Tag to be displayed */
  @Input() tag: Tag;
  /** Current media */
  @Input() media: Media;
  /** Indicates if item is active */
  @Input() active = true;
  /** Event emitter indicating tag action */
  @Output() tagEventEmitter = new EventEmitter<{ action: Action, tag: Tag, tags?: Tag[] }>();
  /** View child for context menu */
  @ViewChild(MatMenuTrigger) contextMenuTrigger: MatMenuTrigger;

  /** Enum for media types */
  mediaType = Media;
  /** Animation state */
  state = AnimationState.INACTIVE;

  //
  // Actions
  //

  /**
   * Handles hover over container
   * @param {boolean} hovered whether there is currently a hover event
   */
  onHoverContainer(hovered: boolean) {
    this.state = hovered ? AnimationState.ACTIVE : AnimationState.INACTIVE;
  }

  /**
   * Handles click on tag
   */
  onTagClicked() {
    this.tagEventEmitter.emit({action: Action.OPEN_DIALOG_UPDATE, tag: this.tag});
  }

  /**
   * Handles clicks on filter button
   */
  onFilterClicked() {
    this.tagEventEmitter.emit({action: Action.FILTER_SINGLE, tag: null, tags: [this.tag]});
  }
}
