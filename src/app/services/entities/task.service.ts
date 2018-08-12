import {Injectable, isDevMode} from '@angular/core';
import {Task} from '../../model/entities/task.model';
import {Subject} from 'rxjs/Subject';
import {takeUntil} from 'rxjs/internal/operators';
import {EntityType} from '../../model/entities/entity-type.enum';
import {SuggestionService} from './filter/suggestion.service';
import {PouchDBService} from '../persistence/pouchdb.service';
import {Project} from '../../model/entities/project.model';
import {ProjectService} from './project.service';
import {environment} from '../../../environments/environment';
import {SnackbarService} from '../ui/snackbar.service';
import {ScopeService} from './scope/scope.service';
import {Scope} from '../../model/scope.enum';
import {TagService} from './tag.service';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  tasks = new Map<string, Task>();
  tasksSubject = new Subject<Task[]>();

  private unsubscribeSubject = new Subject();

  constructor(private pouchDBService: PouchDBService,
              private projectService: ProjectService,
              private tagService: TagService,
              private suggestionService: SuggestionService,
              private snackbarService: SnackbarService,
              private scopeService: ScopeService) {

    this.initializeSubscription();
    this.findOpenTasksByScope(this.scopeService.scope);
  }

  //
  // Initialization
  //

  // <editor-fold desc="Initialization">

  private initializeSubscription() {
    this.tasksSubject.pipe(
      takeUntil(this.unsubscribeSubject)
    ).subscribe((value) => {
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

  public findOpenTasksByScope(scope: Scope) {
    const index = {fields: ['entityType', 'scope', 'modificationDate', 'completionDate']};
    const options = {
      selector: {
        '$and': [
          {'entityType': {'$eq': EntityType.TASK}},
          {'scope': {'$eq': scope}},
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

  private clearTasks() {
    this.tasks = new Map<string, Task>();
  }

  private findTasksInternal(index: any, options: any) {
    this.pouchDBService.find(index, options).then(result => {
        result['docs'].forEach(element => {
          const task = element as Task;
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

  public createTask(task: Task) {
    if (task != null) {
      task.scope = this.scopeService.scope;

      // Update related objects
      this.projectService.updateProject(this.getProjectByTask(task), false);
      task.tagIds.forEach(id => {
        const tag = this.tagService.getTagById(id);
        this.tagService.updateTag(tag, false);
      });

      // Create task
      return this.pouchDBService.upsert(task.id, task).then(() => {
        this.snackbarService.showSnackbar('Created task');
        this.tasks.set(task.id, task);
        this.notify();
      });
    }
  }

  public updateTask(task: Task, showSnack: boolean) {
    if (task != null) {
      // Update related objects
      this.projectService.updateProject(this.getProjectByTask(task), false);
      task.tagIds.forEach(id => {
        const tag = this.tagService.getTagById(id);
        this.tagService.updateTag(tag, false);
      });

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
  }

  public deleteTask(task: Task) {
    if (task != null) {
      this.pouchDBService.remove(task.id, task).then(() => {
        this.snackbarService.showSnackbar('Deleted task');
        this.tasks.delete(task.id);
        this.notify();
      }).catch(() => {
        this.snackbarService.showSnackbarWithAction('An error occurred during deletion', 'RETRY', () => {
          this.deleteTask(task);
        });
      });
    }
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
      return new Date(t2.modificationDate).getTime() - new Date(t1.modificationDate).getTime();
    }));
  }

  // </editor-fold>

  //
  // Lookup
  //

  // <editor-fold desc="Lookup">

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
   * Retrieves a project by a task
   *
   * @param task
   * @returns {any}
   */
  public getProjectByTask(task: Task): Project {

    if (task != null && task.projectId != null) {
      return this.projectService.projects.get(task.projectId);
    }

    return null;
  }

  // </editor-fold>
}
