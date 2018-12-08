import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {Tasklet} from '../../../../../../core/entity/model/tasklet.model';
import {Task} from '../../../../../../core/entity/model/task.model';
import {Media} from '../../../../../../core/ui/model/media.enum';
import {DateService} from '../../../../../../core/entity/services/date.service';
import {DisplayAspect} from '../../../../../../core/entity/services/tasklet/tasklet-display.service';
import {TaskletService} from '../../../../../../core/entity/services/tasklet/tasklet.service';
import {Project} from '../../../../../../core/entity/model/project.model';
import {Action} from '../../../../../../core/entity/model/action.enum';
import {Tag} from '../../../../../../core/entity/model/tag.model';
import {Person} from '../../../../../../core/entity/model/person.model';

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
  /** Topic (typically derived from task name */
  @Input() topic = '';
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
  @Output() taskletEventEmitter = new EventEmitter<{ action: Action, tasklet: Tasklet }>();

  /** References to tags inherited from task */
  inheritedTagIds = [];

  /** Enum for media types */
  mediaType = Media;
  /** Enum for action types */
  actionType = Action;
  /** Enum of display aspects */
  displayAspectType = DisplayAspect;

  /** Expansion panel state */
  expansionPanelOpened = false;

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

  /**
   * Constructor
   * @param taskletService tasklet service
   */
  constructor(private taskletService: TaskletService) {
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
  }

  //
  // Initialization
  //

  /**
   * Initializes expansion panel
   */
  private initializeExpansionPanel() {
    this.expansionPanelOpened = !DateService.isBeforeToday(this.tasklet.creationDate);
  }

  /**
   * Initializes inherited tags
   */
  private initializeInheritedTags() {
    if (this.task != null) {
      this.inheritedTagIds = this.task.tagIds;
    } else {
      this.inheritedTagIds = [];
    }
  }

  //
  // Actions
  //

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
  public containsDisplayAspect(displayAspect: DisplayAspect, tasklet: Tasklet): boolean {
    return this.taskletService.containsDisplayAspect(displayAspect, tasklet);
  }
}
