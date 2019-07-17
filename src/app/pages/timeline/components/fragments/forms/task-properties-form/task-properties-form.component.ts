import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Tag} from '../../../../../../core/entity/model/tag.model';
import {Task} from '../../../../../../core/entity/model/task.model';
import {Person} from '../../../../../../core/entity/model/person.model';
import {Project} from '../../../../../../core/entity/model/project.model';
import {RecurrenceInterval} from '../../../../../../core/entity/model/recurrence-interval.enum';
import {MatSlideToggleChange} from '@angular/material';
import {DateService} from '../../../../../../core/entity/services/date.service';
import {SelectableItem} from '../../../../../../ui/checkable-list/selectable-item';
import {AcceptanceCriterium} from '../../../../../../core/entity/model/acceptance-criterium.model';
import {MaterialColorService} from '../../../../../../core/ui/services/material-color.service';
import {HueType} from '../../../../../../core/ui/model/hue-type.enum';
import {PaletteType} from '../../../../../../core/ui/model/palette-type.enum';

/**
 * Displays form to set task properties
 */
@Component({
  selector: 'app-task-properties-form',
  templateUrl: './task-properties-form.component.html',
  styleUrls: ['./task-properties-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TaskPropertiesFormComponent implements OnInit {

  /** Task to be displayed */
  @Input() task: Task;
  /** Project assigned to this task */
  @Input() project: Project;
  /** Delegated to affiliated to this task */
  @Input() delegatedTo: Person;
  /** Tags assigned to this task */
  @Input() tags: Tag[] = [];
  /** Readonly dialog if true */
  @Input() readonly = false;

  /** Project options */
  @Input() projectOptions = new Map<string, Project>();
  /** Person options */
  @Input() personOptions = new Map<string, Person>();
  /** Tag options */
  @Input() tagOptions = new Map<string, Tag>();

  /** Event emitter indicating task changes */
  @Output() taskEventEmitter = new EventEmitter<{ task: Task, project: Project, delegatedTo: Person, tags: Tag[] }>();

  /** Project option names */
  projectOptionNames = [];
  /** Tag option names */
  tagOptionNames = [];
  /** Person option names */
  personOptionNames = [];

  /** Number of completed acceptance criteria */
  completedAcceptanceCriteria = 0;

  /** Recurring */
  recurring = false;

  /** Color for no priority */
  colorEmpty = '';
  /** Colors for priorities */
  colorsPriorities = [];
  /** Colors for flags */
  colorsFlags = [];

  /** Reference to static method */
  getTimeString = DateService.getTimeString;
  /** Reference to static method */
  getDateString = DateService.getDateString;
  /** Reference to static method */
  getRecurrenceIntervalString = DateService.getRecurrenceIntervalString;
  /** Reference to static method */
  getDayOfWeekString = DateService.getDayOfWeekString;

  /**
   * Constructor
   * @param materialColorService material color service
   */
  constructor(private materialColorService: MaterialColorService) {
  }

  //
  // Lifecycle hooks
  //

  /**
   * Handles on-init lifecycle phase
   */
  ngOnInit() {
    this.initializeColors();
    this.initializeOptions();
    this.initializePriority();
    this.initializeRecurringState();
    this.initializeAcceptanceCriteria();
  }

  //
  // Initialization
  //

  /**
   * INitializes colors
   */
  private initializeColors() {
    this.colorEmpty = this.materialColorService.color(PaletteType.GREY, HueType._300);
    this.colorsPriorities = [
      this.materialColorService.color(PaletteType.RED, HueType._600),
      this.materialColorService.color(PaletteType.AMBER, HueType._600),
      this.materialColorService.color(PaletteType.GREEN, HueType._600)
    ];
    this.colorsFlags = [
      this.materialColorService.color(PaletteType.GREY, HueType._400),
      this.materialColorService.color(PaletteType.GREY, HueType._400),
      this.materialColorService.color(PaletteType.GREY, HueType._400)
    ];
  }

  /**
   * Initializes options
   */
  private initializeOptions() {
    this.projectOptionNames = Array.from(this.projectOptions.values()).sort((p1, p2) => {
      return new Date(p2.modificationDate).getTime() > new Date(p1.modificationDate).getTime() ? 1 : -1;
    }).map(project => {
      return project.name;
    });
    this.personOptionNames = Array.from(this.personOptions.values()).sort((p1, p2) => {
      return new Date(p2.modificationDate).getTime() > new Date(p1.modificationDate).getTime() ? 1 : -1;
    }).map(person => {
      return person.name;
    });
    this.tagOptionNames = Array.from(this.tagOptions.values()).sort((p1, p2) => {
      return new Date(p2.modificationDate).getTime() > new Date(p1.modificationDate).getTime() ? 1 : -1;
    }).map(tag => {
      return tag.name;
    });
  }

  /**
   * Initializes priority
   */
  private initializePriority() {
    if (this.task != null) {
      const taskPriority = this.task.priority;

      this.colorsFlags.forEach((flagColor, index) => {
        if (index === taskPriority) {
          this.colorsFlags[index] = this.colorsPriorities[this.task.priority];
        } else {
          this.colorsFlags[index] = this.colorEmpty;
        }
      });
    }
  }

  /**
   * Initializes recurring state
   */
  private initializeRecurringState() {
    this.recurring = this.task != null
      && this.task.recurrenceInterval !== RecurrenceInterval.UNSPECIFIED
      && this.task.recurrenceInterval !== RecurrenceInterval.NONE;
  }

  /**
   * Initializes acceptance criteria
   */
  private initializeAcceptanceCriteria() {
    if (this.task != null && this.task.acceptanceCriteria != null) {
      this.completedAcceptanceCriteria = this.task.acceptanceCriteria.filter(c => {
        return c.selected;
      }).length;
    }
  }

  //
  // Actions
  //

  // Recurring

  /**
   * Handles changes in recurring flag
   * @param event event
   */
  onRecurringChanged(event: MatSlideToggleChange) {
    this.recurring = event.checked;
    if (!this.recurring) {
      this.task.recurrenceInterval = RecurrenceInterval.NONE;
    }
  }

  // Completion date

  /**
   * Handles completion date changes
   * @param value completion date
   */
  onCompletionDateChanged(value: Date) {
    this.task.completionDate = value;
    this.notify();
  }

  // Due date

  /**
   * Handles due date changes
   * @param value due date
   */
  onDueDateChanged(value: Date) {
    this.task.dueDate = value;
  }

  /**
   * Handles click on end-of-business button
   */
  endOfBusinessClicked() {
    this.task.dueDate = new Date(DateService.getEndOfBusiness(new Date()));
  }

  /**
   * Handles click on end-of-week button
   */
  endOfWeekClicked() {
    this.task.dueDate = new Date(DateService.getEndOfWorkWeek(new Date()));
  }

  // Recurrence interval

  /**
   * Handles recurrence interval changes
   * @param value recurrence interval
   */
  onRecurrenceIntervalChanged(value: RecurrenceInterval) {
    this.task.recurrenceInterval = value;
    this.notify();
  }

  // Priority

  /**
   * Handles hover over priority flags
   * @param priority priority hovered over
   */
  onHoverFlag(priority: number) {
    if (!this.readonly) {
      this.colorsFlags[priority] = this.colorsPriorities[priority];
    }
  }

  /**
   * Handles leave of priority flags
   */
  onLeaveFlag() {
    if (!this.readonly) {
      this.initializePriority();
      this.notify();
    }
  }

  /**
   * Handles click on priority flags
   * @param priority priority clicked on
   */
  onClickFlag(priority: number) {
    if (!this.readonly) {
      if (this.task != null) {
        this.task.priority = priority;
      }

      if (priority === 4) {
        this.colorsFlags = [
          this.materialColorService.color(PaletteType.GREY, HueType._400),
          this.materialColorService.color(PaletteType.GREY, HueType._400),
          this.materialColorService.color(PaletteType.GREY, HueType._400)
        ];
      }
      this.notify();
    }
  }

  // Project

  /**
   * Handles project changes
   * @param project project
   */
  onProjectChanged(project: Project) {
    this.project = this.evaluateProject(project.name, this.projectOptions);
    this.task.projectId = this.project.id;
    console.log(`onProjectChanged ${JSON.stringify(this.project)}`);
    console.log(`onProjectChanged ${JSON.stringify(this.task)}`);
    this.notify();
  }

  // Effort

  /**
   * Handles effort changes
   * @param effort effort
   */
  onEffortChanged(effort: number) {
    this.task.effort = effort;
    this.notify();
  }

  // Delegated to

  /**
   * Handles delegated to changes
   * @param delegatedTo delegated to value
   */
  onDelegatedToChanged(delegatedTo: Person) {
    this.delegatedTo = this.evaluatePerson(delegatedTo.name, this.personOptions);
    this.task.delegatedToId = delegatedTo.id;
    this.notify();
  }

  // Tags

  /**
   * Handles tag changes
   * @param tags new tags
   */
  onTagsChanged(tags: string[]) {
    this.tags = tags.map(t => {
      return new Tag(t);
    });
    this.notify();
  }

  // Description

  /**
   * Handles description changes
   * @param text text
   */
  onDescriptionChanged(text: string) {
    this.task.description.value = text;
    this.notify();
  }

  // Acceptance criteria

  /**
   * Handles acceptance criteria changes
   * @param items acceptance criteria
   */
  onAcceptanceCriteriaChanged(items: SelectableItem[]) {
    if (this.task != null) {
      this.task.acceptanceCriteria = items as AcceptanceCriterium[];
      this.initializeAcceptanceCriteria();
      this.notify();
    }
  }

  //
  // Helpers
  //

  /**
   * Checks if a given project's name correlates to any exiting project
   * @param projectName project name
   * @param projectsMap map of existing projects
   */
  private evaluateProject(projectName: string, projectsMap: Map<string, Project>) {
    const projectsWithSameName = Array.from(projectsMap.values()).filter(p => {
      return projectName === p.name;
    });

    return (projectsWithSameName != null && projectsWithSameName.length > 0) ? projectsWithSameName[0] : new Project(projectName);
  }

  /**
   * Checks if a given person's name correlates to any exiting person
   * @param personName person name
   * @param personsMap map of existing persons
   */
  private evaluatePerson(personName: string, personsMap: Map<string, Person>) {
    const personsWithSameName = Array.from(personsMap.values()).filter(p => {
      return personName === p.name;
    });

    return (personsWithSameName != null && personsWithSameName.length > 0) ? personsWithSameName[0] : new Person(personName);
  }

  //
  // Notifications
  //

  /**
   * Informs subscribers that something has changed
   */
  private notify() {
    this.taskEventEmitter.emit({
      task: this.task,
      project: this.project,
      delegatedTo: this.delegatedTo,
      tags: this.tags
    });
  }
}
