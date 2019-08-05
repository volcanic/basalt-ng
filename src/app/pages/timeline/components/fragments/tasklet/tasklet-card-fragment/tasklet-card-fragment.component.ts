import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {Tasklet} from '../../../../../../core/entity/model/tasklet.model';
import {Task} from '../../../../../../core/entity/model/task.model';
import {Media} from '../../../../../../core/ui/model/media.enum';
import {DateService} from '../../../../../../core/entity/services/date.service';
import {TaskletDisplayAspect} from '../../../../../../core/entity/services/tasklet/tasklet-display.service';
import {TaskletService} from '../../../../../../core/entity/services/tasklet/tasklet.service';
import {Project} from '../../../../../../core/entity/model/project.model';
import {Action} from '../../../../../../core/entity/model/action.enum';
import {Tag} from '../../../../../../core/entity/model/tag.model';
import {Person} from '../../../../../../core/entity/model/person.model';
import {DomSanitizer} from '@angular/platform-browser';
import {environment} from '../../../../../../../environments/environment';

/**
 * Displays tasklet as card
 */
@Component({
  selector: 'app-tasklet-card-fragment',
  templateUrl: './tasklet-card-fragment.component.html',
  styleUrls: ['./tasklet-card-fragment.component.scss']
})
export class TaskletCardFragmentComponent implements OnInit, OnChanges {

  /** Tasklet to be displayed */
  @Input() tasklet: Tasklet;
  /** Task to be displayed */
  @Input() task: Task;
  /** Project */
  @Input() project: Project;
  /** Topic (typically derived from task name) */
  @Input() title = '';
  /** Subtitle (typically derived from project name) */
  @Input() subtitle = '';
  /** Icon name */
  @Input() icon = '';

  /** Map of tags */
  @Input() tags = new Map<string, Tag>();
  /** Map of persons */
  @Input() persons = new Map<string, Person>();
  /** Current media */
  @Input() media: Media;
  /** Default theme to be used */
  @Input() themeClass = 'light-theme';

  /** Event emitter indicating click on tasklet */
  @Output() taskletEventEmitter = new EventEmitter<{ action: Action, tasklet: Tasklet, task: Task, project: Project }>();

  /** References to tags inherited from task */
  inheritedTagIds = [];

  /** Enum for media types */
  mediaType = Media;
  /** Enum for action types */
  actionType = Action;
  /** Enum of display aspects */
  displayAspectType = TaskletDisplayAspect;

  /** Expansion panel state */
  expansionPanelOpened = false;
  /** Custom card style */
  cardStyle: any;

  /** Placeholder for emtpy description */
  placeholderDescription = 'Click here to add description';
  /** Placeholder for emtpy meeting minutes */
  placeholderMeetingMinutes = 'Click here to add meeting minutes';
  /** Placeholder for emtpy daily scrum items */
  placeholderDailyScrum = 'Click here to add daily scrum items';

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

  /** Debug mode */
  debugMode = environment.DEBUG_MODE;

  /**
   * Constructor
   * @param sanitizer sanitizer
   * @param taskletService tasklet service
   */
  constructor(private sanitizer: DomSanitizer,
              private taskletService: TaskletService) {
  }

  //
  // Lifecycle hooks
  //

  /**
   * Handles on-init lifecycle phase
   */
  ngOnInit() {
    this.initializeExpansionPanel();
  }

  /**
   * Handles on-changes lifecycle phase
   */
  ngOnChanges(changes: SimpleChanges) {
    this.initializeInheritedTags();
    this.initializeCardStyle();
  }

  //
  // Initialization
  //

  /**
   * Initializes expansion panel
   */
  private initializeExpansionPanel() {
    this.expansionPanelOpened = this.tasklet != null && !DateService.isBeforeToday(this.tasklet.creationDate);
  }

  /**
   * Initializes inherited tags
   */
  private initializeInheritedTags() {
    if (this.task != null && this.task.tagIds != null) {
      this.inheritedTagIds = this.task.tagIds;
    } else {
      this.inheritedTagIds = [];
    }
  }

  /**
   * Initializes card style
   */
  private initializeCardStyle() {
    this.cardStyle = (this.project != null && this.project.color != null)
      ? this.sanitizer.bypassSecurityTrustStyle(`border-left: 2px solid ${this.project.color}`) : '';
  }

  //
  // Actions
  //

  /**
   * Handles click on card header
   */
  onCardHeaderClicked() {
    this.taskletEventEmitter.emit({
      action: Action.NONE,
      tasklet: this.tasklet,
      task: this.task,
      project: this.project
    });
  }

  /**
   * Handles click on creation time
   */
  onCreationTimeClicked() {
    this.taskletEventEmitter.emit({
      action: Action.OPEN_DIALOG_CREATION_TIME,
      tasklet: this.tasklet,
      task: this.task,
      project: this.project
    });
  }

  /**
   * Handles click on tags holder
   */
  onTagsHolderClicked() {
    this.taskletEventEmitter.emit({
      action: Action.NONE,
      tasklet: this.tasklet,
      task: this.task,
      project: this.project
    });
  }

  /**
   * Handles click on continue button
   */
  onContinueButtonClicked() {
    this.taskletEventEmitter.emit({
      action: Action.OPEN_DIALOG_CONTINUE,
      tasklet: this.tasklet,
      task: this.task,
      project: this.project
    });
  }

  /**
   * Handles expansion panel toggle
   */
  onExpansionPanelToggled() {
    this.expansionPanelOpened = !this.expansionPanelOpened;
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
