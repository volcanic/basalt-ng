import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Tasklet} from '../../../../../../core/entity/model/tasklet.model';
import {Media} from '../../../../../../core/ui/model/media.enum';
import {DateService} from '../../../../../../core/entity/services/date.service';
import {DisplayAspect} from '../../../../../../core/entity/services/tasklet/tasklet-display.service';
import {TaskletService} from '../../../../../../core/entity/services/tasklet.service';
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
export class TaskletCardFragmentComponent implements OnInit {

  /** Tasklet to be displayed */
  @Input() tasklet: Tasklet;
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
  /** Creation time */
  @Input() time = '';
  /** Creation weekday */
  @Input() weekday = '';
  /** Creation date */
  @Input() date = '';
  /** Simple creation date */
  @Input() simpleDate = '';
  /** Current media */
  @Input() media: Media;

  /** Default theme to be used */
  @Input() themeClass = 'light-theme';

  /** Event emitter indicating click on tasklet */
  @Output() taskletEventEmitter = new EventEmitter<{ action: Action, tasklet: Tasklet }>();

  /** Enum for media types */
  mediaType = Media;
  /** Enum for action types */
  actionType = Action;
  /** Enum of display aspects */
  displayAspectType = DisplayAspect;

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

  //
  // Initialization
  //

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
