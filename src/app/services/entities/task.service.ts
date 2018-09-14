import {Injectable, isDevMode} from '@angular/core';
import {Task} from '../../model/entities/task.model';
import {Subject} from 'rxjs/Subject';
import {EntityType} from '../../model/entities/entity-type.enum';
import {SuggestionService} from './filter/suggestion.service';
import {PouchDBService} from '../../core/persistence/services/pouchdb.service';
import {Project} from '../../model/entities/project.model';
import {ProjectService} from './project.service';
import {environment} from '../../../environments/environment';
import {SnackbarService} from '../../core/ui/services/snackbar.service';
import {ScopeService} from './scope/scope.service';
import {Scope} from '../../model/scope.enum';
import {TagService} from './tag.service';

/**
 * Handles tasks including
 * <li> Queries
 * <li> Persistence
 * <li> Lookup
 */
@Injectable({
  providedIn: 'root'
})
export class TaskService {

  /** Map of all tasks */
  tasks = new Map<string, Task>();
  /** Subject that can be subscribed by components that are interested in changes */
  tasksSubject = new Subject<Task[]>();

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
              private snackbarService: SnackbarService,
              private scopeService: ScopeService) {

    this.initializeTaskSubscription();
    this.findOpenTasksByScope(this.scopeService.scope);
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
      limit: environment.LIMIT_TASKS
    };

    this.clearTasks();
    this.findTasksInternal(index, options);
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
            this.updateTask(task, false).then(() => {
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

  // </editor-fold>

  //
  // Persistence
  //

  // <editor-fold desc="Persistence">

  /**
   * Creates a new task
   * @param {Task} task tasak to be created
   * @param {boolean} showSnack shows snackbar if true
   */
  public createTask(task: Task, showSnack: boolean = false): Promise<any> {
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
          if (showSnack) {
            this.snackbarService.showSnackbar('Created task');
          }
          this.tasks.set(task.id, task);
          this.notify();
        });
      }
    });
  }

  /**
   * Updates existing task
   * @param {Task} task task to be updated
   * @param {boolean} showSnack shows snackbar if true
   */
  public updateTask(task: Task, showSnack: boolean = false): Promise<any> {
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
          if (showSnack) {
            this.snackbarService.showSnackbar('Updated task');
          }
          this.tasks.set(task.id, task);
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
          this.snackbarService.showSnackbar('Deleted task');
          this.tasks.delete(task.id);
          this.notify();
        }).catch(() => {
          this.snackbarService.showSnackbarWithAction('An error occurred during deletion', 'RETRY', () => {
            this.deleteTask(task).then(() => {
            });
          });
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
  // Notification
  //

  // <editor-fold desc="Notification">

  /**
   * Informs subscribers that something has changed
   */
  public notify() {
    this.tasksSubject.next(Array.from(this.tasks.values()).sort((t1, t2) => {
      return new Date(t2.modificationDate).getTime() > new Date(t1.modificationDate).getTime() ? 1 : -1;
    }));
  }

  // </editor-fold>
}
