import {Injectable, isDevMode} from '@angular/core';
import {Task} from '../../model/entities/task.model';
import {Subject} from 'rxjs/Subject';
import {takeUntil} from 'rxjs/internal/operators';
import {EntityType} from '../../model/entities/entity-type.enum';
import {SuggestionService} from '../suggestion.service';
import {PouchDBService} from '../pouchdb.service';
import {Project} from '../../model/entities/project.model';
import {ProjectService} from './project.service';
import {environment} from '../../../environments/environment';
import {SnackbarService} from '../snackbar.service';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  tasks = new Map<string, Task>();
  tasksSubject = new Subject<Task[]>();

  private unsubscribeSubject = new Subject();

  constructor(private pouchDBService: PouchDBService,
              private projectService: ProjectService,
              private suggestionService: SuggestionService,
              private snackbarService: SnackbarService) {

    this.initializeSubscription();
    this.findTasks();
  }

  //
  // Initialization
  //

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

  //
  // Lookup
  //

  public findTasks() {

    const index = {fields: ['modificationDate', 'entityType']};
    const options = {
      selector: {
        '$and': [
          {'entityType': {'$eq': EntityType.TASK}},
          {'modificationDate': {'$gt': null}}
        ]
      }, sort: [{'modificationDate': 'desc'}], limit: environment.LIMIT_TASKS
    };

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

  //
  // Persistence
  //

  public createTask(task: Task) {
    if (task != null) {
      this.projectService.updateProject(this.getProjectByTask(task), false);

      return this.pouchDBService.upsert(task.id, task).then(() => {
        this.snackbarService.showSnackbar('Created task');
        this.tasks.set(task.id, task);
        this.notify();
      });
    }
  }

  public updateTask(task: Task, showSnack: boolean) {
    if (task != null) {
      this.projectService.updateProject(this.getProjectByTask(task), false);

      task.modificationDate = new Date();

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
        this.tasks.set(task.id, task);
        this.notify();
      }).catch((err) => {
        this.snackbarService.showSnackbarWithAction('An error occurred during deletion', 'RETRY', () => {
          this.deleteTask(task);
        });
      });
    }
  }

  /**
   * Informs subscribers that something has changed
   */
  public notify() {
    this.tasksSubject.next(Array.from(this.tasks.values()));
  }

  //
  // Lookup
  //

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
}
