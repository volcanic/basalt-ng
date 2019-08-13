import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output} from '@angular/core';
import {Tasklet} from 'app/core/entity/model/tasklet.model';
import {Media} from 'app/core/ui/model/media.enum';
import {Task} from 'app/core/entity/model/task.model';
import {Project} from 'app/core/entity/model/project.model';
import {Tag} from 'app/core/entity/model/tag.model';
import {Person} from 'app/core/entity/model/person.model';
import {Action} from '../../../../../core/entity/model/action.enum';
import {TaskletService} from '../../../../../core/entity/services/tasklet/tasklet.service';

/**
 * Displays tasklet list
 */
@Component({
  selector: 'app-tasklet-list',
  templateUrl: './tasklet-list.component.html',
  styleUrls: ['./tasklet-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TaskletListComponent implements OnChanges {

  /** Map of tasklets */
  @Input() taskletsMap = new Map<string, Tasklet>();
  /** Map of tasks */
  @Input() tasksMap = new Map<string, Task>();
  /** Map of projects */
  @Input() projectsMap = new Map<string, Project>();
  /** Map of tags */
  @Input() tagsMap = new Map<string, Tag>();
  /** Map of persons */
  @Input() personsMap = new Map<string, Person>();
  /** Current media */
  @Input() media: Media;

  /** Event emitter indicating tasklet action */
  @Output() taskletEventEmitter = new EventEmitter<{ action: Action, tasklet: Tasklet }>();
  /** Event emitter indicating new creation date to queue */
  @Output() taskletCreationDateEventEmitter = new EventEmitter<Date>();

  /** Tasklets to be displayed */
  tasklets = [];

  //
  // Lifecycle hooks
  //

  /**
   * Handles on-changes lifecycle phase
   */
  ngOnChanges() {
    this.initializeTasklets();
  }

  //
  // Initialization
  //

  /**
   * Initializes tasklets
   */
  private initializeTasklets() {
    this.tasklets = Array.from(this.taskletsMap.values()).sort(
      TaskletService.sortTaskletsByCreationDate
    );
  }

  //
  // Actions
  //

  /**
   * Handles tasklet event
   * @param event event
   */
  onTaskletEvent(event: any) {
    this.taskletEventEmitter.emit(event);
  }

  /**
   * Handles click on placeholder
   */
  onPlaceholderClicked() {
    this.taskletEventEmitter.emit({action: Action.OPEN_DIALOG_ADD, tasklet: null});
  }

  /**
   * Handles new elements in the viewport
   * @param tasklet tasklet being in the viewport
   */
  public onIntersection(tasklet: Tasklet) {
    this.taskletCreationDateEventEmitter.emit(tasklet.creationDate);
  }
}
