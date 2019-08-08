import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import {MatMenuTrigger} from '@angular/material';
import {Tasklet} from 'app/core/entity/model/tasklet.model';
import {DateService} from 'app/core/entity/services/date.service';
import {TaskletType} from 'app/core/entity/model/tasklet-type.enum';
import {Project} from 'app/core/entity/model/project.model';
import {Task} from 'app/core/entity/model/task.model';
import {Media} from 'app/core/ui/model/media.enum';
import {ColorService} from 'app/core/ui/services/color.service';
import {Action} from 'app/core/entity/model/action.enum';
import {Tag} from 'app/core/entity/model/tag.model';
import {Person} from 'app/core/entity/model/person.model';
import {TaskletService} from '../../../../../core/entity/services/tasklet/tasklet.service';
import {TaskletDisplayAspect} from '../../../../../core/entity/services/tasklet/tasklet-display.service';

/**
 * Displays tasklet list item
 */
@Component({
  selector: 'app-tasklet-list-item',
  templateUrl: './tasklet-list-item.component.html',
  styleUrls: ['./tasklet-list-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TaskletListItemComponent implements OnInit, OnChanges {

  /** Tasklet to be displayed */
  @Input() tasklet: Tasklet;
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
  @Output() taskletEventEmitter = new EventEmitter<{
    action: Action,
    tasklet: Tasklet,
    task: Task,
    project: Project
  }>();

  /** Trigger for context menu */
  @ViewChild(MatMenuTrigger, {static: false}) contextMenuTrigger: MatMenuTrigger;

  /** Task associated with this tasklet */
  task: Task;

  /** Default theme to be used */
  themeClass = 'light-theme';

  /** Enum for media types */
  mediaType = Media;
  /** Enum for action types */
  actionType = Action;
  /** Enum for tasklet types */
  taskletType = TaskletType;
  /** Enum of display aspects */
  displayAspectType = TaskletDisplayAspect;

  /** Icon name */
  icon = '';
  /** Title (typically derived from task name */
  title = '';
  /** Subtitle (typically derived from project name */
  subtitle = '';
  /** Project */
  project: Project;
  /** Project personColor */
  projectColor = 'transparent';
  /** Creation time */
  time = '';
  /** Creation weekday */
  weekday = '';
  /** Creation date */
  date = '';
  /** Simple creation date */
  simpleDate = '';
  /** Calendar week */
  calendarWeek = '';

  /** Whether or not the tasklet is the last of its week */
  isLastOfWeek = false;
  /** Whether or not the tasklet is the last of its day */
  isLastOfDay = false;

  /**
   * Constructor
   * @param colorService color service
   * @param taskletService tasklet service
   */
  constructor(private colorService: ColorService,
              private taskletService: TaskletService) {
  }

  //
  // Lifecycle hooks
  //

  /**
   * Handles on-init lifecycle phase
   */
  ngOnInit() {
    this.initializeIcon();
    this.initializeTask();
    this.initializeProject();
    this.initializeIconColor();
  }

  /**
   * Handles on-changes lifecycle phase
   */
  ngOnChanges(changes: SimpleChanges) {
    this.initializeDate();
    this.initializeTask();
    this.initializeProject();
    this.initializeIconColor();
    this.initializeTopic();
  }

  //
  // Initialization
  //

  /**
   * Initializes icon
   */
  private initializeIcon() {
    if (this.tasklet != null) {
      this.icon = TaskletService.getIconByTaskletType(this.tasklet.type);
    }
  }

  /**
   * Initializes date
   */
  private initializeDate() {
    if (this.tasklet != null) {
      this.time = DateService.getTimeString(new Date(this.tasklet.creationDate));
      this.weekday = DateService.getWeekDayString(new Date(this.tasklet.creationDate).getDay());
      this.date = DateService.getDateString(new Date(this.tasklet.creationDate));
      this.simpleDate = DateService.getSimpleDateWithoutYearString(new Date(this.tasklet.creationDate));
      this.calendarWeek = DateService.getWeekNumber(new Date(this.tasklet.creationDate)).toString();

      this.isLastOfWeek = this.taskletService.isLastOfWeek(this.tasklet, this.taskletsMap);
      this.isLastOfDay = this.taskletService.isLastOfDay(this.tasklet, this.taskletsMap);
    }
  }

  /**
   * Initializes task
   */
  private initializeTask() {
    this.task = this.tasklet ? this.tasksMap.get(this.tasklet.taskId) : null;
  }


  /**
   * Initializes project
   */
  private initializeProject() {
    if (this.tasklet != null && this.task != null && this.task.projectId != null) {
      this.project = this.projectsMap.get(this.task.projectId);
    }
  }

  /**
   * Initializes icon color
   */
  private initializeIconColor() {
    const project = (this.task != null) ? this.projectsMap.get(this.task.projectId) : null;
    this.projectColor = (project != null && project.color != null) ? project.color : '';
  }

  /**
   * Initializes topic
   */
  private initializeTopic() {
    switch (this.tasklet.type) {
      case TaskletType.LUNCH_BREAK:
      case TaskletType.FINISHING_TIME: {
        this.title = this.tasklet.type;
        break;
      }
      default: {
        if (this.task != null) {
          if (this.task.proxy) {
            this.title = `Generic ${this.project != null ? this.project.name : ''} task`;
            this.subtitle = this.project != null ? this.project.name : ' ';
          } else if (this.task.name != null && this.task.name.length > 0) {
            this.title = this.task.name;
            this.subtitle = this.project != null ? this.project.name : ' ';
          } else {
            this.title = this.tasklet.type;
          }
        } else {
          this.title = this.tasklet.type;
        }
      }
    }
  }

  //
  // Actions
  //

  /**
   * Handles click on tasklet
   * @param event event
   */
  onTaskletClicked(event: { action: Action, tasklet: Tasklet, task: Task, project: Project }) {
    switch (event.action) {
      case Action.NONE: {
        if (this.media > this.mediaType.MEDIUM) {
          this.taskletEventEmitter.emit({
            action: Action.OPEN_DIALOG_UPDATE,
            tasklet: event.tasklet,
            task: event.task,
            project: event.project
          });
        } else {
          this.contextMenuTrigger.openMenu();
        }
        break;
      }
      default: {
        this.taskletEventEmitter.emit({
          action: event.action,
          tasklet: event.tasklet,
          task: event.task,
          project: event.project,
        });
      }
    }
  }

  /**
   * Handles click on update tasklet button
   */
  onUpdateTaskletClicked() {
    this.taskletEventEmitter.emit({
      action: Action.OPEN_DIALOG_UPDATE,
      tasklet: this.tasklet,
      task: this.task,
      project: this.project
    });
  }

  /**
   * Handles click on update creation time button
   */
  onUpdateCreationTimeClicked() {
    this.taskletEventEmitter.emit({
      action: Action.OPEN_DIALOG_CREATION_TIME,
      tasklet: this.tasklet,
      task: this.task,
      project: this.project
    });
  }

  /**
   * Handles click on continue tasklet button
   */
  onContinueTaskletClicked() {
    this.taskletEventEmitter.emit({
      action: Action.OPEN_DIALOG_CONTINUE,
      tasklet: this.tasklet,
      task: this.task,
      project: this.project
    });
  }

  //
  // Helpers (UI)
  //

  /**
   * Determines whether the displayed tasklet contains a specific display aspect
   * @param displayAspect display aspect
   * @param tasklet tasklet
   */
  public containsDisplayAspect(displayAspect: TaskletDisplayAspect, tasklet: Tasklet): boolean {
    return this.taskletService.containsDisplayAspect(displayAspect, tasklet);
  }
}
