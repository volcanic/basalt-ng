import {Injectable, isDevMode} from '@angular/core';
import {Task} from '../../model/task.model';
import {Subject} from 'rxjs';
import {EntityType} from '../../model/entity-type.enum';
import {SuggestionService} from '../suggestion.service';
import {PouchDBService} from '../../../persistence/services/pouchdb.service';
import {Project} from '../../model/project.model';
import {ProjectService} from '../project/project.service';
import {environment} from '../../../../../environments/environment';
import {ScopeService} from '../scope.service';
import {Scope} from '../../model/scope.enum';
import {TagService} from '../tag/tag.service';
import {RecurrenceInterval} from '../../model/recurrence-interval.enum';
import {DateService} from '../date.service';
import {TaskDisplayAspect, TaskDisplayService} from './task-display.service';
import {Tasklet} from '../../model/tasklet.model';
import {SnackbarService} from '../../../ui/services/snackbar.service';
import {Tag} from '../../model/tag.model';

/**
 * Handles tasks including
 * <li> Queries
 * <li> Persistence
 * <li> Lookup
 * <li> Sort
 * <li> Display options
 */

/* tslint:disable:object-literal-key-quotes */
@Injectable({
  providedIn: 'root'
})
export class TaskService {

  /** Subject that publishes tasks */
  tasksSubject = new Subject<Map<string, Task>>();
  /** Subject that publishes a task */
  taskSubject = new Subject<Task>();

  /** Map of tasks */
  private tasks: Map<string, Task>;
  /** Single task */
  private task: Task;

  //
  // Sort
  //

  /**
   * Sorts tasks based on their due date & due time, effort estimation and priority
   * @param inputTaskA first task
   * @param inputTaskB seconds task
   * @return Returns
   * -1 if inputTaskA is of a higher order (i.e. before inputTaskB),
   * 0 if inputTaskA and inputTaskB are equal and
   * 1 if task B is of a higher order
   */
  static sortTasks(inputTaskA: Task, inputTaskB: Task) {
    let sortingResult = 0; // 0 does not sort, < 0 places inputTaskA first, > 0 places inputTaskB first

    const taskA = TaskService.getSortableTask(inputTaskA);
    const taskB = TaskService.getSortableTask(inputTaskB);

    function aWins() {
      sortingResult = -1;
    }

    function bWins() {
      sortingResult = 1;
    }


    if (taskA.dueTime < taskB.dueTime) {
      if (taskA.calculatedStart < taskB.calculatedStart) {
        if (taskB.calculatedStart < taskA.dueTime) {
          if (taskB.priority > taskA.priority) {
            bWins();
          } else {
            aWins();
          }
        } else {
          aWins();
        }
      } else if (taskA.calculatedStart > taskB.calculatedStart) {
        if (taskA.priority < taskB.priority) {
          bWins();
        } else {
          aWins();
        }
      } else {
        if (taskA.priority < taskB.priority) {
          bWins();
        } else {
          aWins();
        }
      }
    } else if (taskA.dueTime > taskB.dueTime) {
      if (taskA.calculatedStart < taskB.calculatedStart) {
        if (taskA.priority > taskB.priority) {
          aWins();
        } else {
          bWins();
        }
      } else if (taskA.calculatedStart > taskB.calculatedStart) {
        if (taskA.calculatedStart < taskB.dueTime) {
          if (taskA.priority > taskB.priority) {
            aWins();
          } else {
            bWins();
          }
        } else {
          bWins();
        }
      } else {
        if (taskA.priority > taskB.priority) {
          aWins();
        } else {
          bWins();
        }
      }
    } else { // equal due time
      if (taskA.calculatedStart < taskB.calculatedStart) {
        if (taskA.priority < taskB.priority) {
          bWins();
        } else {
          aWins();
        }
      } else if (taskA.calculatedStart > taskB.calculatedStart) {
        if (taskA.priority > taskB.priority) {
          aWins();
        } else {
          bWins();
        }
      } else {
        if (taskA.priority < taskB.priority) {
          bWins();
        } else {
          aWins();
        }
      }
    }
    return sortingResult;
  }

  private static getSortableTask(inputTask: Task) {
    const dueTime = TaskService.getDueTimeInMinutesFromTask(inputTask);
    const effort = inputTask.effort;
    return {
      dueTime,
      effort,
      calculatedStart: dueTime - effort,
      priority: 3 - inputTask.priority // Inverse priority to make calculations more intuitive
    };
  }

  private static getDueTimeInMinutesFromTask(task: Task) {
    return new Date(task.dueDate).getTime() / 1000 / 60;
  }

//
  // Filter
  //

  /**
   * Determines if a task is overdue
   * @param task task
   */
  static isTaskOverdue(task: Task) {
    return task != null
      && !task.proxy
      && task.completionDate == null
      && task.dueDate != null
      && (task.delegatedToId == null || task.delegatedToId === '')
      && (task.recurrenceInterval == null
        || task.recurrenceInterval === RecurrenceInterval.UNSPECIFIED
        || task.recurrenceInterval === RecurrenceInterval.NONE)
      && DateService.isBefore(task.dueDate, new Date());
  }

  /**
   * Determines if a task is due today and is not yet over due
   * @param task task
   */
  static isTaskToday(task: Task) {
    return task != null
      && !task.proxy
      && task.completionDate == null
      && task.dueDate != null
      && (task.delegatedToId == null || task.delegatedToId === '')
      && (task.recurrenceInterval == null
        || task.recurrenceInterval === RecurrenceInterval.UNSPECIFIED
        || task.recurrenceInterval === RecurrenceInterval.NONE)
      && DateService.isToday(task.dueDate)
      && DateService.isAfter(task.dueDate, new Date());
  }

  /**
   * Determines if a task is due today and is not yet over due
   * @param task task
   */
  static isTaskTomorrow(task: Task) {
    return task != null
      && task.completionDate == null
      && task.dueDate != null
      && (task.delegatedToId == null || task.delegatedToId === '')
      && (task.recurrenceInterval == null
        || task.recurrenceInterval === RecurrenceInterval.UNSPECIFIED
        || task.recurrenceInterval === RecurrenceInterval.NONE)
      && DateService.isTomorrow(task.dueDate);
  }

  /**
   * Determines if a task is due later than today
   * @param task task
   */
  static isTaskLater(task: Task) {
    const tomorrow = new Date();
    tomorrow.setDate(new Date().getDate() + 1);

    return task != null
      && !task.proxy
      && task.completionDate == null
      && task.dueDate != null
      && (task.delegatedToId == null || task.delegatedToId === '')
      && (task.recurrenceInterval == null
        || task.recurrenceInterval === RecurrenceInterval.UNSPECIFIED
        || task.recurrenceInterval === RecurrenceInterval.NONE)
      && DateService.isAfter(task.dueDate, DateService.getDayEnd(tomorrow));
  }

  /**
   * Determines if a task is in inbox
   * @param task task
   */
  static isTaskInInbox(task: Task) {
    return task != null
      && !task.proxy
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
  static isTaskDelegated(task: Task) {
    return task != null
      && !task.proxy
      && task.completionDate == null
      && (task.delegatedToId != null && task.delegatedToId !== '');
  }

  /**
   * Determines if a task is recurring
   * @param task task
   */
  static isTaskRecurring(task: Task) {
    return task != null
      && !task.proxy
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
  static isTaskRelevantSoon(task: Task, expectedNextOccurrence: Date) {
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
  static isTaskCompleted(task: Task) {
    return task != null
      && !task.proxy
      && task.completionDate != null;
  }

  //
  // Lookup
  //

  /**
   * Retrieves a project by a given task
   * @param task task to find project by
   * @param projectsMap projects map
   * @returns project referenced by given task, null if no such project exists
   */
  static getProjectByTask(task: Task, projectsMap: Map<string, Project>): Project {
    if (task != null && task.projectId != null) {
      return projectsMap.get(task.projectId);
    }

    return null;
  }

  /**
   * Determines the latest occurrence of a task by looking at its tasklets
   * @param tasklets tasklets associated with this a task
   */
  static getLastestOccurrence(tasklets: Tasklet[]): Date {

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
  static getExpectedNextOccurrence(task: Task, tasklets: Tasklet[]) {
    const lastOccurrence = TaskService.getLastestOccurrence(tasklets);

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
  static containsDisplayAspect(displayAspect: TaskDisplayAspect, task: Task): boolean {
    switch (displayAspect) {
      case TaskDisplayAspect.CAN_BE_CREATED: {
        return TaskDisplayService.canBeCreated(task);
      }
      case TaskDisplayAspect.CAN_BE_UPDATED: {
        return TaskDisplayService.canBeUpdated(task);
      }
    }
  }

  /**
   * Constructor
   * @param pouchDBService pouchDB service
   * @param projectService project service
   * @param snackbarService snackbar service
   * @param suggestionService suggestion service
   * @param scopeService scope service
   * @param tagService tag service
   */
  constructor(private pouchDBService: PouchDBService,
              private projectService: ProjectService,
              private snackbarService: SnackbarService,
              private suggestionService: SuggestionService,
              private scopeService: ScopeService,
              private tagService: TagService) {

    this.initializeTaskSubscription();
  }

  //
  // Initialization
  //

  /**
   * Initializes task subscription
   */
  private initializeTaskSubscription() {
    this.tasksSubject.subscribe((value) => {
      this.suggestionService.updateByTasks(Array.from((value as Map<string, Task>).values()));
    });
  }

  //
  // Fetch
  //

  /**
   * Fetches tasks
   * @param forceReload force reload
   */
  public fetchTasks(forceReload = false) {
    if (this.tasks != null && !forceReload) {
      this.tasksSubject.next(this.tasks);
    } else {
      this.findTasks();
    }
  }

  /**
   * Fetches tasks by scope
   * @param scope scope to filter by
   * @param forceReload force reload
   */
  public fetchTasksByScope(scope: Scope, forceReload = false) {
    if (this.tasks != null && !forceReload) {
      this.tasksSubject.next(this.tasks);
    } else {
      this.findTasksByScope(scope);
    }
  }

  /**
   * Fetches a task by id
   * @param id ID of filter by
   * @param forceReload force reload
   */
  public fetchTaskByID(id: string, forceReload = false) {
    if (this.tasks != null && !forceReload) {
      this.tasksSubject.next(this.tasks);
    } else {
      this.findTaskByID(id);
    }
  }

  //
  // Queries
  //

  /**
   * Loads tasks by a given scope
   */
  private findTasks() {
    const startDate = DateService.addDays(new Date(), -(environment.LIMIT_TASKS_DAYS));

    const index = {fields: ['entityType', 'modificationDate']};
    const options = {
      selector: {
        '$and': [
          {'entityType': {'$eq': EntityType.TASK}},
          {modificationDate: {$gt: startDate.toISOString()}}
        ]
      },
      // sort: [{'modificationDate': 'desc'}],
      limit: environment.LIMIT_TASKS_COUNT
    };

    this.findTasksInternal(index, options);
  }

  /**
   * Loads tasks by a given scope
   * @param scope scope to filter by
   */
  private findTasksByScope(scope: Scope) {
    const startDate = DateService.addDays(new Date(), -(environment.LIMIT_TASKS_DAYS));

    const index = {fields: ['entityType', 'scope', 'modificationDate']};
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

    this.findTasksInternal(index, options);
  }

  /**
   * Loads task by a given ID
   * @param id ID of filter by
   */
  private findTaskByID(id: string) {
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
   * Index tasks and queries them afterwards
   * @param index index to be used
   * @param options query options
   */
  private findTasksInternal(index: any, options: any) {
    this.pouchDBService.find(index, options).then(result => {
        if (result != null) {
          const tasks = new Map<string, Task>();

          result['docs'].forEach(element => {
            const task = element as Task;
            tasks.set(task.id, task);
          });

          this.notifyTasks(tasks);
        }
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
        if (result != null) {
          result['docs'].forEach(element => {
            this.notifyTask(element as Task);
          });
        }
      }, error => {
        if (isDevMode()) {
          console.error(error);
        }
      }
    );
  }

  //
  // Persistence
  //

  /**
   * Creates a new task
   * @param task task to be created
   * @param tasksMap tasks map
   * @param projectsMap projects map
   * @param tagsMap tags map
   */
  public createTask(task: Task, tasksMap: Map<string, Task>, projectsMap: Map<string, Project>, tagsMap: Map<string, Tag>): Promise<any> {
    return new Promise(() => {
      if (task != null) {
        task.scope = this.scopeService.scope;

        // Update related objects
        this.projectService.updateProject(TaskService.getProjectByTask(task, projectsMap), projectsMap).then(() => {
        });
        if (task.tagIds != null) {
          task.tagIds.forEach(id => {
            const tag = tagsMap.get(id);
            this.tagService.updateTag(tag, tagsMap).then(() => {
            });
          });
        }

        // Create task
        return this.pouchDBService.upsert(task.id, task).then(() => {
          tasksMap.set(task.id, task);
          this.notifyTask(task);
          this.notifyTasks(tasksMap);
        });
      }
    });
  }

  /**
   * Creates a task
   * @param name name
   * @param task task
   * @param tasksMap tasks map
   * @param projectsMap projects map
   * @param tagsMap tags map
   */
  public createTaskIfNecessary(name: string, task: Task, tasksMap: Map<string, Task>,
                               projectsMap: Map<string, Project>, tagsMap: Map<string, Tag>): Promise<Task> {
    return new Promise((resolve) => {
      if (task == null || task.name == null || task.name === '') {
        const newTask = new Task(name);
        this.createTask(newTask, tasksMap, projectsMap, tagsMap).then(() => {
        });
        resolve(newTask);
      } else {
        resolve(task);
      }
    });
  }

  /**
   * Creates a proxy task
   * @param proxyTask proxy task
   * @param existingProject existing project
   * @param tasksMap tasks map
   * @param projectsMap projects map
   * @param tagsMap tags map
   */
  public createProxyTaskIfNecessary(proxyTask: Task, existingProject: Project, tasksMap: Map<string, Task>,
                                    projectsMap: Map<string, Project>, tagsMap: Map<string, Tag>): Promise<Task> {
    return new Promise((resolve) => {
      if (proxyTask == null && existingProject != null && existingProject.id != null) {
        const newProxyTask = new Task(`Proxy`);

        newProxyTask.proxy = true;
        newProxyTask.projectId = existingProject.id;

        this.createTask(newProxyTask, tasksMap, projectsMap, tagsMap).then(() => {
        });
        resolve(newProxyTask);
      } else {
        resolve(proxyTask);
      }
    });
  }

  /**
   * Updates existing task
   * @param task task to be updated
   * @param tasksMap tasks map
   * @param projectsMap projects map
   * @param tagsMap tags map
   */
  public updateTask(task: Task, tasksMap: Map<string, Task>, projectsMap: Map<string, Project>, tagsMap: Map<string, Tag>): Promise<any> {
    return new Promise(() => {
      if (task != null) {
        // Update related objects
        this.projectService.updateProject(TaskService.getProjectByTask(task, projectsMap), projectsMap).then(() => {
        });
        if (task.tagIds != null) {
          task.tagIds.forEach(id => {
            const tag = tagsMap.get(id);
            this.tagService.updateTag(tag, tagsMap).then(() => {
            });
          });
        }

        task.modificationDate = new Date();

        // Update task
        return this.pouchDBService.upsert(task.id, task).then(() => {
          tasksMap.set(task.id, task);
          this.notifyTask(task);
          this.notifyTasks(tasksMap);
        });
      }
    });
  }

  /**
   * Deletes a task
   * @param task task to be deleted
   * @param tasksMap task map
   */
  public deleteTask(task: Task, tasksMap: Map<string, Task>): Promise<any> {
    return new Promise(() => {
      if (task != null) {
        this.pouchDBService.remove(task.id).then(() => {
          tasksMap.delete(task.id);
          this.notifyTasks(tasksMap);
        }).catch((error) => {
          if (isDevMode()) {
            console.error(error);
          }
          this.snackbarService.showSnackbarWithAction('An error occurred during deletion', 'RETRY', () => {
            this.deleteTask(task, tasksMap).then(() => {
            });
          });
        });
      }
    });
  }

  //
  // Lookup
  //

  /**
   * Retrieves a task by a given name
   * @param name name to find task by
   * @param tasksMap tasks map
   * @returns task identified by given name, null if no such task exists
   */
  public getTaskByName(name: string, tasksMap: Map<string, Task>): Task {
    return (tasksMap != null) ? Array.from(tasksMap.values()).filter(t => {
      return t.name === name;
    }).find(() => {
      return true;
    }) : null;
  }

  /**
   * Retrieves the proxy task associated with a given project
   * @param project project to find proxy task for
   * @param tasksMap tasks map
   */
  public getProxyTaskByProject(project: Project, tasksMap: Map<string, Task>): Task {
    return Array.from(tasksMap.values()).filter(t => {
      return t.proxy;
    }).filter(t => {
      return t.projectId != null
        && t.projectId === project.id;
    }).find(() => {
      return true;
    });
  }

  //
  // Notification
  //

  /**
   * Informs subscribers that something has changed
   * @param task task
   */
  public notifyTask(task: Task) {
    this.taskSubject.next(task);
  }

  /**
   * Informs subscribers that something has changed
   * @param tasksMap tasks map
   */
  public notifyTasks(tasksMap: Map<string, Task>) {
    this.tasksSubject.next(tasksMap);
  }
}
