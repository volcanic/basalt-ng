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
  @Output() taskletEventEmitter = new EventEmitter<{ action: Action, tasklet: Tasklet }>();
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
  /** Topic (typically derived from task name */
  topic = '';
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

  /** Reference to static service methods */
  isToday = DateService.isToday;
  /** Reference to static service methods */
  isWithinNextDays = DateService.isWithinNextDays;

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
    this.initializeDate();
  }

  /**
   * Handles on-changes lifecycle phase
   */
  ngOnChanges(changes: SimpleChanges) {
    this.initializeTask();
    this.initializeTopic();
    this.initializeProject();
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
    }
  }

  /**
   * Initializes task
   */
  private initializeTask() {
    this.task = this.tasks.get(this.tasklet.taskId);
  }

  /**
   * Initializes topic
   */
  private initializeTopic() {
    switch (this.tasklet.type) {
      case TaskletType.DAILY_SCRUM:
      case TaskletType.LUNCH_BREAK:
      case TaskletType.FINISHING_TIME:
      default: {
        if (this.task != null) {
          this.topic = this.task.name;
        } else {
          this.topic = this.tasklet.type;
        }
      }
    }
  }

  /**
   * Initializes project
   */
  private initializeProject() {
    if (this.tasklet != null && this.task != null && this.task.projectId != null) {
      this.project = this.projects.get(this.task.projectId);
    }

    this.projectColor = this.colorService.getProjectColor(this.project);
  }

  //
  // Actions
  //

  /**
   * Handles click on tasklet
   * @param event event
   */
  onTaskletClicked(event: { action: Action, tasklet: Tasklet }) {
    switch (event.action) {
      case Action.NONE: {
        if (this.media > this.mediaType.MEDIUM) {
          this.taskletEventEmitter.emit({action: Action.OPEN_DIALOG_UPDATE, tasklet: this.tasklet});
        } else {
          this.contextMenuTrigger.openMenu();
        }
        break;
      }
      default: {
        this.taskletEventEmitter.emit({action: event.action, tasklet: event.tasklet});
      }
    }
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
