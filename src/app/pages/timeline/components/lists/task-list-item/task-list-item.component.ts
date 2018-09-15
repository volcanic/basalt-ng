import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output, ViewChild} from '@angular/core';
import {Task} from 'app/core/entity/model/task.model';
import {MatMenuTrigger} from '@angular/material';
import {Animations, AnimationState} from './task-list-item.animation';
import {Media} from 'app/core/ui/model/media.enum';
import {TaskDigest} from 'app/core/digest/model/task-digest.model';
import {Action} from 'app/core/entity/model/action.enum';

/**
 * Displays task list item
 */
@Component({
  selector: 'app-task-list-item',
  templateUrl: './task-list-item.component.html',
  styleUrls: ['./task-list-item.component.scss'],
  animations: [
    Animations.actionAnimation
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TaskListItemComponent {

  /** Task to be display */
  @Input() task: Task;
  /** Task digest */
  @Input() taskDigest: TaskDigest;
  /** Current media */
  @Input() media: Media;
  /** Event emitter indicating task action */
  @Output() taskEventEmitter = new EventEmitter<{Action, Task}>();
  /** View child for context menu */
  @ViewChild(MatMenuTrigger) contextMenuTrigger: MatMenuTrigger;

  /** Enum for media types */
  mediaType = Media;
  /** Enum for action types */
  action = Action;
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
}
