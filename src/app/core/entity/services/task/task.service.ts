import {Injectable, isDevMode} from '@angular/core';
import {Task} from '../../model/task.model';
import {Subject} from 'rxjs/Subject';
import {EntityType} from '../../model/entity-type.enum';
import {SuggestionService} from '../suggestion.service';
import {PouchDBService} from '../../../persistence/services/pouchdb.service';
import {Project} from '../../model/project.model';
import {ProjectService} from '../project.service';
import {environment} from '../../../../../environments/environment';
import {SnackbarService} from '../../../ui/services/snackbar.service';
import {ScopeService} from '../scope.service';
import {Scope} from '../../model/scope.enum';
import {TagService} from '../tag.service';
import {RecurrenceInterval} from '../../model/recurrence-interval.enum';
import {DateService} from '../date.service';
import {DisplayAspect, TaskDisplayService} from './task-display.service';
import {Tasklet} from '../../model/tasklet.model';

/**
 * Handles tasks including
 * <li> Queries
 * <li> Persistence
 * <li> Lookup
 * <li> Display options
 */
@Injectable({
  providedIn: 'root'
})
export class TaskService {

  /** Map of all tasks */
  tasks = new Map<string, Task>();
  /** Subject that can be subscribed by components that are interested in changes */
  tasksSubject = new Subject<Task[]>();

  /** Task in focus */
  task: Task;
  /** Subject that publishes task */
  taskSubject = new Subject<Task>();

  /**
   * Constructor
   * @param {PouchDBService} pouchDBService
   * @param {ProjectService} projectService
   * @param {TagService} tagService
   * @param {SuggestionService} suggestionService
   * @param {SnackbarService} snackbarService
   * @param {ScopeService} scopeService
   */
  constructor(private pouchDBService: PouchDBService,
              private projectService: ProjectService,
              private tagService: TagService,
              private suggestionService: SuggestionService,
              private scopeService: ScopeService) {

    this.initializeTaskSubscription();
    this.findTasksByScope(this.scopeService.scope);
  }

  //
  // Initialization
  //

  // <editor-fold desc="Initialization">

  /**
   * Initializes task subscription
   */
  private initializeTaskSubscription() {
    this.tasksSubject.subscribe((value) => {
      (value as Task[]).forEach(task => {
          this.tasks.set(task.id, task);
        }
      );

      this.suggestionService.updateByTasks(Array.from(this.tasks.values()));
    });
  }

  // </editor-fold>

  //
  // Queries
  //

  // <editor-fold desc="Queries">

  /**
   * Loads tasks by a given scope
   * @param {Scope} scope scope to filter by
   */
  public findTasksByScope(scope: Scope) {
    const startDate = DateService.addDays(new Date(), -(environment.LIMIT_TASKS_DAYS));

    const index = {fields: ['entityType', 'scope', 'modificationDate', 'completionDate']};
    const options = {
      selector: {
        '$and': [
          {'entityType': {'$eq': EntityType.TASK}},
          {scope: {$eq: scope}},
          {modificationDate: {$gt: startDate.toISOString()}}
        ]
      },
      // sort: [{'modificationDate': 'desc'}],
      limit: environment.LIMIT_TASKS_COUNT
    };

    this.clearTasks();
    this.findTasksInternal(index, options);
  }

  /**
   * Loads open tasks by a given scope
   * @param {Scope} scope scope to filter by
   */
  public findOpenTasksByScope(scope: Scope) {
    const index = {fields: ['entityType', 'scope', 'modificationDate', 'completionDate']};
    const options = {
      selector: {
        '$and': [
          {'entityType': {'$eq': EntityType.TASK}},
          {scope: {$eq: scope}},
          {'modificationDate': {'$gt': null}},
          {'completionDate': {'$eq': null}}
        ]
      },
      // sort: [{'modificationDate': 'desc'}],
      limit: environment.LIMIT_TASKS_COUNT
    };

    this.clearTasks();
    this.findTasksInternal(index, options);
  }

  /**
   * Loads closed tasks by a given scope
   * @param {Scope} scope scope to filter by
   */
  public findClosedTasksByScope(scope: Scope) {
    const index = {fields: ['entityType', 'scope', 'modificationDate', 'completionDate']};
    const options = {
      selector: {
        '$and': [
          {'entityType': {'$eq': EntityType.TASK}},
          {scope: {$eq: scope}},
          {'modificationDate': {'$gt': null}},
          {'completionDate': {'$ne': null}}
        ]
      },
      // sort: [{'modificationDate': 'desc'}],
      limit: environment.LIMIT_TASKS_COUNT
    };

    this.clearTasks();
    this.findTasksInternal(index, options);
  }

  /**
   * Loads task by a given ID
   * @param {number} id ID of filter by
   */
  public findTaskByID(id: string) {
    const index = {fields: ['entityType', 'id', 'creationDate']};
    const options = {
      selector: {
        '$and': [
          {entityType: {$eq: EntityType.TASK}},
          {id: {$eq: id}}
        ]
      },
      // sort: [{creationDate: 'desc'}],
      limit: environment.LIMIT_TASKS_COUNT
    };

    this.findTaskInternal(index, options);
  }

  /**
   * Clears tasks
   */
  private clearTasks() {
    this.tasks.clear();
  }

  /**
   * Index tasks and queries them afterwards
   * @param index index to be used
   * @param options query options
   */
  private findTasksInternal(index: any, options: any) {
    this.pouchDBService.find(index, options).then(result => {
        result['docs'].forEach(element => {
          const task = element as Task;

          if (task.scope == null) {
            task.scope = this.scopeService.scope;
            this.updateTask(task).then(() => {
            });
          }

          this.tasks.set(task.id, task);
        });

        this.notify();
      }, error => {
        if (isDevMode()) {
          console.error(error);
        }
      }
    );
  }

  /**
   * Index tasks and queries them afterwards
   * @param index index to be used
   * @param options query options
   */
  private findTaskInternal(index: any, options: any) {
    this.pouchDBService.find(index, options).then(result => {
        result['docs'].forEach(element => {
          this.task = element as Task;
        });
        this.notify();
      }, error => {
        if (isDevMode()) {
          console.error(error);
        }
      }
    );
  }

  // </editor-fold>

  //
  // Persistence
  //

  // <editor-fold desc="Persistence">

  /**
   * Creates a new task
   * @param {Task} task tasak to be created
   */
  public createTask(task: Task): Promise<any> {
    return new Promise(() => {
      if (task != null) {
        task.scope = this.scopeService.scope;

        // Update related objects
        this.projectService.updateProject(this.getProjectByTask(task), false).then(() => {
        });
        if (task.tagIds != null) {
          task.tagIds.forEach(id => {
            const tag = this.tagService.getTagById(id);
            this.tagService.updateTag(tag, false).then(() => {
            });
          });
        }

        // Create task
        return this.pouchDBService.upsert(task.id, task).then(() => {
          this.tasks.set(task.id, task);
          this.task = task;
          this.notify();
        });
      }
    });
  }

  /**
   * Updates existing task
   * @param {Task} task task to be updated
   */
  public updateTask(task: Task): Promise<any> {
    return new Promise(() => {
      if (task != null) {
        // Update related objects
        this.projectService.updateProject(this.getProjectByTask(task), false).then(() => {
        });
        if (task.tagIds != null) {
          task.tagIds.forEach(id => {
            const tag = this.tagService.getTagById(id);
            this.tagService.updateTag(tag, false).then(() => {
            });
          });
        }

        task.modificationDate = new Date();

        // Update task
        return this.pouchDBService.upsert(task.id, task).then(() => {
          this.tasks.set(task.id, task);
          this.task = task;
          this.notify();
        });
      }
    });
  }

  /**
   * Deletes a task
   * @param {Task} task task to be deleted
   */
  public deleteTask(task: Task): Promise<any> {
    return new Promise(() => {
      if (task != null) {
        this.pouchDBService.remove(task.id, task).then(() => {
          this.tasks.delete(task.id);
          this.task = null;
          this.notify();
        }).catch(() => {
          console.error('An error occurred during deletion');
        });
      }
    });
  }

  // </editor-fold>

  //
  // Lookup
  //

  // <editor-fold desc="Lookup">

  /**
   * Retrieves a task by a given name
   * @param {string} name name to find task by
   * @returns {Task} task identified by given name, null if no such task exists
   */
  public getTaskByName(name: string): Task {
    let task: Task = null;

    Array.from(this.tasks.values()).forEach(t => {
      if (t.name === name) {
        task = t;
      }
    });

    return task;
  }

  /**
   * Retrieves a project by a given task
   * @param {Task} task task to find project by
   * @returns {Project} project referenced by given task, null if no such project exists
   */
  public getProjectByTask(task: Task): Project {
    if (task != null && task.projectId != null) {
      return this.projectService.projects.get(task.projectId);
    }

    return null;
  }

  // </editor-fold>

  //
  // Filter
  //

  /**
   * Determines if a task is overdue
   * @param task task
   */
  public isTaskOverdue(task: Task) {
    return task != null
      && task.completionDate == null
      && task.dueDate != null
      && (task.delegatedToId == null || task.delegatedToId === '')
      && (task.recurrenceInterval == null
        || task.recurrenceInterval === RecurrenceInterval.UNSPECIFIED
        || task.recurrenceInterval === RecurrenceInterval.NONE)
      && DateService.isBefore(task.dueDate, new Date());
  }

  /**
   * Determines if a task is due today
   * @param task task
   */
  public isTaskToday(task: Task) {
    return task != null
      && task.completionDate == null
      && task.dueDate != null
      && (task.delegatedToId == null || task.delegatedToId === '')
      && (task.recurrenceInterval == null
        || task.recurrenceInterval === RecurrenceInterval.UNSPECIFIED
        || task.recurrenceInterval === RecurrenceInterval.NONE)
      && DateService.isToday(task.dueDate);
  }

  /**
   * Determines if a task is due later than today
   * @param task task
   */
  public isTaskLater(task: Task) {
    return task != null
      && task.completionDate == null
      && task.dueDate != null
      && (task.delegatedToId == null || task.delegatedToId === '')
      && (task.recurrenceInterval == null
        || task.recurrenceInterval === RecurrenceInterval.UNSPECIFIED
        || task.recurrenceInterval === RecurrenceInterval.NONE)
      && DateService.isAfter(task.dueDate, DateService.getDayEnd(new Date()));
  }

  /**
   * Determines if a task is in inbox
   * @param task task
   */
  public isTaskInInbox(task: Task) {
    return task != null
      && task.completionDate == null
      && task.dueDate == null
      && (task.delegatedToId == null || task.delegatedToId === '')
      && (task.recurrenceInterval == null
        || task.recurrenceInterval === RecurrenceInterval.UNSPECIFIED
        || task.recurrenceInterval === RecurrenceInterval.NONE);
  }

  /**
   * Determines if a task is delegated to someone
   * @param task task
   */
  public isTaskDelegated(task: Task) {
    return task != null
      && task.completionDate == null
      && (task.delegatedToId != null && task.delegatedToId !== '');
  }

  /**
   * Determines if a task is recurring
   * @param task task
   */
  public isTaskRecurring(task: Task) {
    return task != null
      && task.completionDate == null
      && (task.delegatedToId == null || task.delegatedToId === '')
      && task.recurrenceInterval != null
      && (task.recurrenceInterval !== RecurrenceInterval.UNSPECIFIED && task.recurrenceInterval !== RecurrenceInterval.NONE);
  }

  /**
   * Determines if a task is relevant soon
   * @param task task
   * @param expectedNextOccurrence expected next occurrence
   */
  public isTaskRelevantSoon(task: Task, expectedNextOccurrence: Date) {
    if (task != null && expectedNextOccurrence != null) {
      const now = new Date();

      let minutesBefore = 0;
      let minutesAfter = 0;

      switch (task.recurrenceInterval) {
        case RecurrenceInterval.DAILY: {
          minutesBefore = 15;
          minutesAfter = 5;
          break;
        }
        case RecurrenceInterval.WEEKLY: {
          minutesBefore = 15;
          minutesAfter = 5;
          break;
        }
        case RecurrenceInterval.MONTHLY: {
          minutesBefore = 60;
          minutesAfter = 5;
          break;
        }
      }

      const minutesBeforeStart = DateService.addMinutes(expectedNextOccurrence, -minutesBefore);
      const minutesAfterStart = DateService.addMinutes(expectedNextOccurrence, minutesAfter);
      return DateService.isAfter(now, minutesBeforeStart) && DateService.isBefore(now, minutesAfterStart);
    }

    return false;
  }

  /**
   * Determines if a task is completed
   * @param task task
   */
  public isTaskCompleted(task: Task) {
    return task != null && task.completionDate != null;
  }

  //
  // Sort
  //

  // <editor-fold desc="Sort">

  /**
   * Sorts tasks based on their due date & due time, effort estimation and priority
   * @param taskA first task
   * @param taskB seconds task
   * @return Returns -1 if taskA is of a higher order (i.e. before taskB), 0 if taskA and taskB are equal and 1 if task B is of a higher order
   */
  public sortTasks(taskA: Task, taskB: Task) {
    let returnValue = 0; // 0 does not sort, < 0 places taskA first, > 0 places taskB first

    const dueTimeA = new Date(taskA.dueDate).getTime() / 1000 / 60; // Get due time in milliseconds and convert to minutes
    const effortA = taskA.effort; // Get effort in minutes
    const calculatedStartA = dueTimeA - effortA; // Calculate start time for comparison with taskB
    const priorityA = taskA.priority; // get priority

    const dueTimeB = new Date(taskB.dueDate).getTime() / 1000 / 60; // Get due time in milliseconds and convert to minutes
    const effortB = taskB.effort; // Get effort in minutes
    const calculatedStartB = dueTimeB - effortB; // Calculate start time for comparison with taskB
    const priorityB = taskB.priority; // get priority

    if (dueTimeA < dueTimeB) {  // A comes first
      if (calculatedStartB < dueTimeA) { // B comes first
        if (priorityA < priorityB) { // A comes first
          returnValue = -1;
        } else { // B stays first
          returnValue = 1;
        }
      } else { // A stays first
        returnValue = -1;
      }
    } else if (dueTimeA === dueTimeB) {
      if (calculatedStartB < dueTimeA) { // B comes first
        if (priorityA < priorityB) { // A comes first
          returnValue = -1;
        } else { // B stays first
          returnValue = 1;
        }
      } else { // A stays first
        returnValue = -1;
      }
    } else { // B comes first
      if (calculatedStartA < dueTimeB) { // A comes first
        if (priorityB < priorityA) { // B comes first
          returnValue = 1;
        } else { // A stays first
          returnValue = -1;
        }
      } else { // B stays first
        returnValue = 1;
      }
    }

    return returnValue;
  }

  // </editor-fold>

  //
  // Lookup
  //

  /**
   * Determines the latest occurrence of a task by looking at its tasklets
   * @param tasklets tasklets associated with this a task
   */
  public getLastestOccurrence(tasklets: Tasklet[]): Date {

    if (tasklets.length > 0) {
      return tasklets[0].creationDate;
    } else {
      return null;
    }
  }

  /**
   * Determines the expected next occurrence of a task by looking at its tasklets
   * @param task task
   * @param tasklets tasklets associated with this a task
   */
  public getExpectedNextOccurrence(task: Task, tasklets: Tasklet[]) {
    const lastOccurrence = this.getLastestOccurrence(tasklets);

    if (lastOccurrence != null) {
      switch (task.recurrenceInterval) {
        case RecurrenceInterval.DAILY: {
          return DateService.addDays(lastOccurrence, 1);
        }
        case RecurrenceInterval.WEEKLY: {
          return DateService.addDays(lastOccurrence, 7);
        }
        case RecurrenceInterval.MONTHLY: {
          return DateService.addMonths(lastOccurrence, 1);
        }
      }
    } else {
      return null;
    }
  }

  //
  // Delegated: Display aspects
  //

  /**
   * Determines if a given tasklet contains a display aspect
   * @param displayAspect display aspect
   * @param task tasks
   */
  public containsDisplayAspect(displayAspect: DisplayAspect, task: Task): boolean {
    switch (displayAspect) {
      case DisplayAspect.CAN_BE_CREATED: {
        return TaskDisplayService.canBeCreated(task);
      }
      case DisplayAspect.CAN_BE_UPDATED: {
        return TaskDisplayService.canBeUpdated(task);
      }
    }
  }

  //
  // Notification
  //

  // <editor-fold desc="Notification">

  /**
   * Informs subscribers that something has changed
   */
  public notify() {
    this.taskSubject.next(this.task);
    this.tasksSubject.next(Array.from(this.tasks.values()));
  }

  // </editor-fold>
}
