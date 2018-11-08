import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Tasklet} from '../../../../../../core/entity/model/tasklet.model';
import {Media} from '../../../../../../core/ui/model/media.enum';
import {DateService} from '../../../../../../core/entity/services/date.service';
import {Action} from '../../../../../../core/entity/model/action.enum';

/**
 * Displays tasklet as preview
 */
@Component({
  selector: 'app-tasklet-preview-fragment',
  templateUrl: './tasklet-preview-fragment.component.html',
  styleUrls: ['./tasklet-preview-fragment.component.scss']
})
export class TaskletPreviewFragmentComponent {

  /** Tasklet to be displayed */
  @Input() tasklet: Tasklet;
  /** Topic (typically derived from task name */
  @Input() topic = '';
  /** Icon name */
  @Input() icon = '';
  /** Current media */
  @Input() media: Media;

  /** Event emitter indicating click on tasklet */
  @Output() taskletEventEmitter = new EventEmitter<{ action: Action, tasklet: Tasklet }>();

  /** Enum for media types */
  mediaType = Media;
  /** Enum for action types */
  actionType = Action;

  /** Reference to static service methods */
  isToday = DateService.isToday;
  /** Reference to static service methods */
  isWithinNextDays = DateService.isWithinNextDays;
}
