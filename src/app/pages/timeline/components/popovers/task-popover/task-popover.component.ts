import {Component, Input, OnInit} from '@angular/core';
import {Task} from '../../../../../core/entity/model/task.model';
import {Project} from '../../../../../core/entity/model/project.model';
import {Person} from '../../../../../core/entity/model/person.model';
import {Tag} from '../../../../../core/entity/model/tag.model';
import {ProjectService} from '../../../../../core/entity/services/project.service';
import {PersonService} from '../../../../../core/entity/services/person.service';
import {TagService} from '../../../../../core/entity/services/tag.service';
import {RecurrenceInterval} from '../../../../../core/entity/model/recurrence-interval.enum';
import {Tasklet} from '../../../../../core/entity/model/tasklet.model';
import {DigestService} from '../../../../../core/digest/services/digest/digest.service';
import {TaskEffort} from '../../../../../core/digest/model/task-effort.model';

/**
 * Displays a task popover
 */
@Component({
  selector: 'app-task-popover',
  templateUrl: './task-popover.component.html',
  styleUrls: ['./task-popover.component.scss']
})
export class TaskPopoverComponent implements OnInit {

  /** Task to be displayed */
  @Input() task: Task;
  /** Tasklets */
  @Input() tasklets: Tasklet[];

  /** Project assigned to this task */
  project: Project;
  /** Delegated to affiliated to this task */
  delegatedTo: Person;
  /** Tags assigned to this task */
  tags: Tag[] = [];

  /** Task effort */
  taskEffort: TaskEffort;

  /** Icon name */
  icon = 'alias_task';

  //
  // Helpers
  //

  /**
   * Determines if task is complete
   * @param task task
   */
  private static isTaskComplete(task: Task): boolean {
    return task.dueDate != null
      && task.description != null && task.description.value != null
      && task.acceptanceCriteria != null && task.acceptanceCriteria.length > 0
      && task.projectId != null
      && task.dueDate != null
      && task.priority != null
      && task.effort != null
      && task.tagIds != null;
  }

  /**
   * Constructor
   * @param digestService digest service
   * @param personService person service
   * @param projectService project service
   * @param tagService tag service
   */
  constructor(private digestService: DigestService,
              private personService: PersonService,
              private projectService: ProjectService,
              private tagService: TagService) {
  }

  //
  // Lifecycle hooks
  //

  /**
   * Handles on-init lifecycle phase
   */
  ngOnInit() {
    this.initializeTask(this.task);
    this.initializeIcon();

    this.taskEffort = this.digestService.getTaskEffort(this.tasklets, this.task);
  }

  //
  // Initialization
  //

  /**
   * Initializes task
   * @param task task to be initialized
   */
  private initializeTask(task: Task) {
    this.task = task;
    if (task != null) {
      this.project = this.projectService.projects.get(this.task.projectId);
      this.tags = task.tagIds.map(id => {
        return this.tagService.tags.get(id);
      }).filter(tag => {
        return tag != null;
      });
      this.delegatedTo = this.personService.persons.get(task.delegatedToId);
    }
  }

  /**
   * Initializes icon
   */
  private initializeIcon() {
    if (this.task != null
      && this.task.completionDate == null
      && this.task.recurrenceInterval != null
      && (this.task.recurrenceInterval !== RecurrenceInterval.UNSPECIFIED && this.task.recurrenceInterval !== RecurrenceInterval.NONE)) {
      this.icon = 'loop';
    } else if (this.task != null && this.task.delegatedToId != null && this.task.delegatedToId !== '') {
      this.icon = 'person';
    } else if (this.task != null && TaskPopoverComponent.isTaskComplete(this.task)) {
      this.icon = 'alias_task';
    } else {
      this.icon = 'alias_task_unassigned';
    }
  }
}
