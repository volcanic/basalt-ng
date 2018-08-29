import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output, SimpleChanges} from '@angular/core';
import {Tasklet} from '../../../model/entities/tasklet.model';
import {Media} from '../../../model/ui/media.enum';
import {Task} from '../../../model/entities/task.model';
import {Project} from '../../../model/entities/project.model';
import {Tag} from '../../../model/entities/tag.model';
import {Person} from '../../../model/entities/person.model';

/**
 * Displays tasklet list
 */
@Component({
  selector: 'app-tasklet-list',
  templateUrl: './tasklet-list.component.html',
  styleUrls: ['./tasklet-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TaskletListComponent {

  /** Tasklets to be displayed */
  @Input() tasklets = [];
  /** Current media */
  @Input() media: Media;

  /** Map of tasks */
  @Input() tasks = new Map<string, Task>();
  /** Map of projects */
  @Input() projects = new Map<string, Project>();
  /** Map of tags */
  @Input() tags = new Map<string, Tag>();
  /** Map of persons */
  @Input() persons = new Map<string, Person>();

  /** Event emitter indicating tasklet action */
  @Output() taskletEventEmitter = new EventEmitter<{ Action, Tasklet }>();
  /** Event emitter indicating new creation date to queue */
  @Output() taskletCreationDateEventEmitter = new EventEmitter<Date>();

  //
  // Actions
  //

  /**
   * Handles new elements in the viewport
   * @param {Tasklet} tasklet tasklet being in the viewport
   */
  public onIntersection(tasklet: Tasklet) {
    this.taskletCreationDateEventEmitter.emit(tasklet.creationDate);
  }
}
