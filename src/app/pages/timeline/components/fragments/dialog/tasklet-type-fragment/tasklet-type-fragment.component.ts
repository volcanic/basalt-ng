import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges
} from '@angular/core';
import {TaskletType} from 'app/core/entity/model/tasklet-type.enum';
import {Tasklet} from 'app/core/entity/model/tasklet.model';
import {ColorService} from '../../../../../../core/ui/services/color.service';
import {TaskletTypeGroup} from '../../../../../../core/entity/model/tasklet-type-group.enum';
import {FeatureService} from '../../../../../../core/settings/services/feature.service';
import {TaskletService} from '../../../../../../core/entity/services/tasklet/tasklet.service';
import {FeatureType} from '../../../../../../core/settings/model/feature-type.enum';
import {environment} from '../../../../../../../environments/environment';

/**
 * Represents a tasklet type group action button
 */
class TaskletTypeGroupAction {

  /** Tasklet type group */
  group: TaskletTypeGroup;
  /** Label to be displayed */
  label: string;
  /** Icon to be used */
  icon: string;
  /** Background color to be used */
  backgroundColor: string;
  /** Background color to be used */
  iconColor: string;
  /** Tasklet types in context menu */
  taskletTypes = [];
}

/**
 * Displays tasklet type fragment
 */
@Component({
  selector: 'app-tasklet-type-fragment',
  templateUrl: './tasklet-type-fragment.component.html',
  styleUrls: ['./tasklet-type-fragment.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TaskletTypeFragmentComponent implements OnInit, OnChanges {

  /** Tasklet to be displayed */
  @Input() tasklet: Tasklet;
  /** Event emitter indicating tasklet type selection */
  @Output() taskletTypeEventEmitter = new EventEmitter<TaskletType>();

  /** Available tasklet types */
  taskletTypes = Object.keys(TaskletType).map(key => TaskletType[key]);
  /** Available tasklet type groups */
  taskletTypeGroups = Object.keys(TaskletTypeGroup).map(key => TaskletTypeGroup[key]);
  /** List of tasklet type actions */
  taskletTypeActions = [];
  /** Currently selected group */
  selectedGroup: TaskletTypeGroup;
  /** Currently hovered group */
  hoveredGroup: TaskletTypeGroup;

  /**
   * Constructor
   * @param colorService color service
   * @param featureService feature service
   * @param taskletService tasklet service
   */
  constructor(private colorService: ColorService,
              private featureService: FeatureService,
              private taskletService: TaskletService) {
  }

  //
  // Lifecycle hooks
  //

  /**
   * Handles on-init lifecycle phase
   */
  ngOnInit() {
    this.initializeTaskletTypeGroups();
  }

  /**
   * Handles on-changes lifecycle phase
   */
  ngOnChanges(changes: SimpleChanges) {
    // Update color of all actions
    this.taskletTypeActions.forEach(this.updateActionColor);
  }

  //
  // Initialization
  //

  /**
   * Initializes tasklet types
   */
  initializeTaskletTypeGroups() {
    this.taskletTypeActions = [];
    this.taskletTypeGroups.filter(this.filterTaskletTypes).forEach(this.initializeTaskletTypeGroup);
  }

  //
  // Actions
  //

  /**
   * Handles selection of tasklet type
   * @param taskletType tasklet type action
   * @param action tasklet type group action
   */
  onTaskletTypeSelected(taskletType: TaskletType, action: TaskletTypeGroupAction) {
    this.taskletTypeEventEmitter.emit(taskletType);

    this.selectedGroup = action.group;

    // Update color of all actions
    this.taskletTypeActions.forEach(this.updateActionColor);
  }

  /**
   * Handles hover over container
   * @param hovered whether there is currently a hover event
   * @param action tasklet type group action
   */
  onHoverContainer(hovered: boolean, action: TaskletTypeGroupAction) {
    this.hoveredGroup = hovered ? action.group : null;

    // Update color of hovered action
    this.updateActionColor(action);
  }

  //
  // Helpers
  //

  /**
   * Updates color of a given tasklet type group action
   * @param action tasklet type group action
   */
  private updateActionColor(action: TaskletTypeGroupAction) {
    this.taskletTypeActions.filter(a => {
      return a === action;
    }).forEach((a: TaskletTypeGroupAction) => {
      const group = a.group;
      action.backgroundColor = this.getGroupColor(group);
      action.iconColor = this.getGroupContrast(group);
    });
  }

  /**
   * Retrieves a color by tasklet type group
   * @param group tasklet type group
   */
  private getGroupColor(group: TaskletTypeGroup): string {
    if (this.tasklet != null && (this.tasklet.type != null && this.taskletService.groupContainsType(group, this.tasklet.type))
      || (this.hoveredGroup === group)) {
      return this.colorService.getTaskletTypeGroupColor(group).color;
    } else {
      return this.colorService.getTaskletTypeGroupColor(null).color;
    }
  }

  /**
   * Retrieves a contrast color by tasklet type group
   * @param group tasklet type group
   */
  private getGroupContrast(group: TaskletTypeGroup): string {
    if (this.tasklet != null && (this.tasklet.type != null && this.taskletService.groupContainsType(group, this.tasklet.type))
      || (this.hoveredGroup === group)) {
      return this.colorService.getTaskletTypeGroupColor(group).contrast;
    } else {
      return this.colorService.getTaskletTypeGroupColor(null).contrast;
    }
  }

  /**
   * Retrieves an icon by tasklet type
   * @param type tasklet type
   */
  public getIconByTaskletType(type: TaskletType): string {
    return this.taskletService.getIconByTaskletType(type);
  }

  /**
   * Determines whether a tasklet type group shall be displayed
   * @param group tasklet type group
   */
  private filterTaskletTypes(group: TaskletTypeGroup): boolean {
    return group !== TaskletTypeGroup.UNSPECIFIED
      && group !== TaskletTypeGroup.BREAK
      && !(group === TaskletTypeGroup.SCRUM && this.isTaskletTypeScrumEnabled())
      && !(group === TaskletTypeGroup.DEVELOPMENT && this.isTaskletTypeDevelopmentEnabled());
  }

  /**
   * Determines whether tasklet type scrum is enabled
   */
  private isTaskletTypeScrumEnabled(): boolean {
    return !this.featureService.isFeatureActive(FeatureType.SCRUM) || !environment.FEATURE_TOGGLE_SCRUM;
  }

  /**
   * Determines whether tasklet type development is enabled
   */
  private isTaskletTypeDevelopmentEnabled(): boolean {
    return !this.featureService.isFeatureActive(FeatureType.DEVELOPMENT) || !environment.FEATURE_TOGGLE_DEVELOPMENT;
  }

  /**
   * Initializes a tasklet type group
   * @param group tasklet type group
   */
  private initializeTaskletTypeGroup(group: TaskletTypeGroup) {
    const action = new TaskletTypeGroupAction();
    action.group = group;
    action.backgroundColor = this.getGroupColor(group);
    action.iconColor = this.getGroupContrast(group);
    action.icon = this.taskletService.getIconByTaskletTypeGroup(group);
    action.label = group.toString();
    action.taskletTypes = this.taskletService.getTaskletTypesByGroup(group).filter(type => {
      return type !== TaskletType.DEVELOPMENT
        && !(group === TaskletTypeGroup.DEVELOPMENT && !this.featureService.isFeatureActive(FeatureType.DEVELOPMENT))
        && !(type === TaskletType.DAILY_SCRUM && !this.featureService.isFeatureActive(FeatureType.SCRUM))
        && !(type === TaskletType.POMODORO && !this.featureService.isFeatureActive(FeatureType.POMODORO));
    });
    this.taskletTypeActions.push(action);
  }
}
