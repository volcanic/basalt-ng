import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild} from '@angular/core';
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
import {TaskletTypeService} from '../../../../../core/entity/services/tasklet-type.service';

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
  @ViewChild(MatMenuTrigger) contextMenuTrigger: MatMenuTrigger;

  /** Default theme to be used */
  themeClass = 'light-theme';

  /** Enum for media types */
  mediaType = Media;
  /** Enum for tasklet types */
  taskletType = TaskletType;
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
  weekDay = '';
  /** Creation date */
  date = '';
  /** Simple creation date */
  simpleDate = '';

  /** Expansion panel state */
  expansionPanelOpened = false;
  /** Reference to static service methods */
  isToday = DateService.isToday;
  /** Reference to static service methods */
  isBeforeNow = DateService.isBeforeNow;
  /** Reference to static service methods */
  isBeforeToday = DateService.isBeforeToday;
  /** Reference to static service methods */
  isWithinNextDays = DateService.isWithinNextDays;
  /** Reference to static service methods */
  isInCurrentWeek = DateService.isInCurrentWeek;

  /**
   * Constructor
   * @param colorService color service
   * @param taskletTypeService tasklet type service
   */
  constructor(private colorService: ColorService, private taskletTypeService: TaskletTypeService) {
  }

  //
  // Lifecycle hooks
  //

  /**
   * Handles on-init lifecycle hook
   */
  ngOnInit() {
    this.initializeIcon();
    this.initializeDate();
    this.initializeExpansionPanel();
  }

  /**
   * Handles on-changes lifecycle hook
   */
  ngOnChanges(changes: SimpleChanges) {
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
    this.icon = this.taskletTypeService.getIconByTaskletType(this.tasklet.type);
  }

  /**
   * Initializes date
   */
  private initializeDate() {
    this.time = DateService.getTimeString(new Date(this.tasklet.creationDate));
    this.weekDay = DateService.getWeekDayString(new Date(this.tasklet.creationDate).getDay());
    this.date = DateService.getDateString(new Date(this.tasklet.creationDate));
    this.simpleDate = DateService.getSimpleDateWithoutYearString(new Date(this.tasklet.creationDate));
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
        const task = this.getTaskByTasklet(this.tasklet);

        if (task != null) {
          this.topic = task.name;
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
    this.project = this.getProjectByTasklet(this.tasklet);
    this.projectColor = this.colorService.getProjectColor(this.project);
  }

  /**
   * Initializes expansion panel
   */
  private initializeExpansionPanel() {
    this.expansionPanelOpened = !DateService.isBeforeToday(this.tasklet.creationDate);
  }

  //
  // Actions
  //

  /**
   * Handles click on tasklet
   */
  onTaskletClicked() {
    if (this.media > this.mediaType.MEDIUM) {
      this.taskletEventEmitter.emit({action: Action.OPEN_DIALOG_UPDATE, tasklet: this.tasklet});
    } else {
      this.contextMenuTrigger.openMenu();
    }
  }

  /**
   * Handles click on update button
   */
  onUpdateClicked() {
    this.taskletEventEmitter.emit({action: Action.OPEN_DIALOG_UPDATE, tasklet: this.tasklet});
  }

  /**
   * Handles click on tasklet creation time
   */
  onTaskletCreationTimeClicked() {
    this.taskletEventEmitter.emit({action: Action.OPEN_DIALOG_CREATION_TIME, tasklet: this.tasklet});
  }

  /**
   * Handles click on continue button
   */
  onContinueClicked() {
    this.taskletEventEmitter.emit({action: Action.OPEN_DIALOG_CONTINUE, tasklet: this.tasklet});
  }

  /**
   * Handles click on template button
   */
  onTemplateClicked() {
    this.taskletEventEmitter.emit({action: Action.OPEN_DIALOG_TEMPLATE, tasklet: this.tasklet});
  }

  /**
   * Handles expansion panel toggle
   */
  onExpansionPanelToggled() {
    this.expansionPanelOpened = !this.expansionPanelOpened;
  }

  //
  // Helpers
  //

  /**
   * Retrieves a task by a given tasklet
   * @param {Tasklet} tasklet tasklet to find task by
   * @returns {Task} task referenced by given tasklet, null if no such task exists
   */
  public getTaskByTasklet(tasklet: Tasklet): Task {
    if (tasklet != null && tasklet.taskId != null) {
      return this.tasks.get(tasklet.taskId);
    }

    return null;
  }

  /**
   * Retrieves a project by a given tasklet
   * @param {Tasklet} tasklet tasklet to find project by
   * @returns {Project} project referenced by given tasklet, null if no such project exists
   */
  public getProjectByTasklet(tasklet: Tasklet): Project {
    const task = this.getTaskByTasklet(tasklet);

    if (tasklet != null && task != null && task.projectId != null) {
      return this.projects.get(task.projectId);
    }

    return null;
  }

  //
  // Helpers
  //

  /**
   * Determines whether the displayed tasklet can be assigned to a task
   * @param tasklet tasklet
   */
  public canBeAssignedToTask(tasklet: Tasklet): boolean {
    return tasklet != null && (tasklet.type === TaskletType.ACTION
      || tasklet.type === TaskletType.POMODORO
      || tasklet.type === TaskletType.MEETING
      || tasklet.type === TaskletType.CALL
      || tasklet.type === TaskletType.MAIL
      || tasklet.type === TaskletType.CHAT
      || tasklet.type === TaskletType.DEVELOPMENT
      || tasklet.type === TaskletType.CODING
      || tasklet.type === TaskletType.DEBUGGING
      || tasklet.type === TaskletType.DOCUMENTATION
      || tasklet.type === TaskletType.REVIEW
      || tasklet.type === TaskletType.TESTING
      || tasklet.type === TaskletType.IDEA);
  }

  /**
   * Determines whether the displayed tasklet contains a description
   * @param tasklet tasklet
   */
  public containsDescription(tasklet: Tasklet): boolean {
    return tasklet != null && (tasklet.type === TaskletType.ACTION
      || tasklet.type === TaskletType.POMODORO
      || (tasklet.type === TaskletType.MEETING
        && tasklet.description != null
        && tasklet.description.value != null
        && tasklet.description.value !== '')
      || (tasklet.type === TaskletType.CALL
        && tasklet.description != null
        && tasklet.description.value != null
        && tasklet.description.value !== '')
      || tasklet.type === TaskletType.MAIL
      || tasklet.type === TaskletType.CHAT
      || tasklet.type === TaskletType.DEVELOPMENT
      || tasklet.type === TaskletType.CODING
      || tasklet.type === TaskletType.DEBUGGING
      || tasklet.type === TaskletType.DOCUMENTATION
      || tasklet.type === TaskletType.REVIEW
      || tasklet.type === TaskletType.TESTING);
  }

  /**
   * Determines whether the displayed tasklet contains meeting minutes
   * @param tasklet tasklet
   */
  public containsMeetingMinutes(tasklet: Tasklet) {
    return tasklet != null && (tasklet.type === TaskletType.MEETING
      || tasklet.type === TaskletType.CALL
      || tasklet.type === TaskletType.MAIL
      || tasklet.type === TaskletType.CHAT);
  }

  /**
   * Determines whether the displayed tasklet contains pomodoro tasks
   * @param tasklet tasklet
   */
  public containsPomodoroTask(tasklet: Tasklet) {
    return tasklet != null && tasklet.type === TaskletType.POMODORO;
  }

  /**
   * Determines whether the displayed tasklet is continuable
   */
  public isContinuable() {
    return this.tasklet.type === TaskletType.ACTION
      || this.tasklet.type === TaskletType.MEETING
      || this.tasklet.type === TaskletType.DEVELOPMENT
      || this.tasklet.type === TaskletType.DEBUGGING
      || this.tasklet.type === TaskletType.IDEA;
  }

  /**
   * Determines whether the displayed tasklet is templatable
   */
  public isTemplatable() {
    return this.tasklet.type === TaskletType.DAILY_SCRUM;
  }
}
