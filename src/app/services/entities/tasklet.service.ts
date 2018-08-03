import {Injectable, isDevMode} from '@angular/core';
import {Tasklet} from '../../model/entities/tasklet.model';
import {Subject} from 'rxjs';
import {Person} from '../../model/person.model';
import {TASKLET_TYPE} from '../../model/tasklet-type.enum';
import {TaskletDailyScrum} from '../../model/tasklet-daily-scrum.model';
import {DateService} from '../date.service';
import {EntityType} from '../../model/entities/entity-type.enum';
import {takeUntil} from 'rxjs/internal/operators';
import {SuggestionService} from '../suggestion.service';
import {PouchDBService} from '../pouchdb.service';
import {Project} from '../../model/entities/project.model';
import {Task} from '../../model/entities/task.model';
import {TaskService} from './task.service';
import {ProjectService} from './project.service';
import {environment} from '../../../environments/environment';

@Injectable()
export class TaskletService {
  tasklets = new Map<string, Tasklet>();
  taskletsSubject = new Subject<Tasklet[]>();

  private unsubscribeSubject = new Subject();

  constructor(private pouchDBService: PouchDBService,
              private projectService: ProjectService,
              private taskService: TaskService,
              private dateService: DateService,
              private suggestionService: SuggestionService) {

    this.initializeSubscription();
    this.findTasklets(1000);
  }

  //
  // Initialization
  //

  private initializeSubscription() {
    this.taskletsSubject.pipe(
      takeUntil(this.unsubscribeSubject)
    ).subscribe((value) => {
      (value as Tasklet[]).forEach(tasklet => {
          this.tasklets.set(tasklet.id, tasklet);
        }
      );

      this.suggestionService.updateByTasklets(Array.from(this.tasklets.values()));
    });
  }

  //
  // Lookup
  //

  public findTasklets(limit: number) {

    const index = {fields: ['creationDate', 'entityType']};
    const options = {
      selector: {
        '$and': [
          {'entityType': {'$eq': EntityType.TASKLET}},
          {'creationDate': {'$gt': null}}
        ]
      }, sort: [{'creationDate': 'desc'}], limit: environment.LIMIT_TASKLETS
    };

    this.pouchDBService.find(index, options).then(result => {

        result['docs'].forEach(element => {
          const tasklet = element as Tasklet;
          this.tasklets.set(tasklet.id, tasklet);
          this.notify();
        });
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

  public createTasklet(tasklet: Tasklet) {
    this.pouchDBService.put(tasklet.id, tasklet);
    this.tasklets.set(tasklet.id, tasklet);
    this.notify();
  }

  public updateTasklet(tasklet: Tasklet) {
    this.pouchDBService.put(tasklet.id, tasklet);
    this.tasklets.set(tasklet.id, tasklet);
    this.notify();
  }

  public deleteTasklet(tasklet: Tasklet) {
    this.pouchDBService.remove(tasklet.id, tasklet);
    this.tasklets.delete(tasklet.id);
    this.notify();
  }

  /**
   * Informs subscribers that something has changed
   */
  public notify() {
    console.log('notify');
    this.taskletsSubject.next(Array.from(this.tasklets.values()));
  }

  //
  // Lookup
  //

  /**
   * Retrieves a tasklet by a tasks
   *
   * @param tasklet
   * @returns {any}
   */
  public getTaskByTasklet(tasklet: Tasklet): Task {
    if (tasklet != null && tasklet.taskId != null) {
      return this.taskService.tasks.get(tasklet.taskId);
    }

    return null;
  }

  /**
   * Retrieves a project by a tasklet
   *
   * @param tasklet
   * @returns {any}
   */
  public getProjectByTasklet(tasklet: Tasklet): Project {
    const task = this.getTaskByTasklet(tasklet);

    if (tasklet != null && task != null && task.projectId != null) {
      return this.projectService.projects.get(task.projectId);
    }

    return null;
  }

  /**
   * Returns a map of recent daily scrum activities of a given person
   * @param person given person
   * @returns {IterableIterator<string>}
   */
  public getDailyScrumActivities(person: Person): Map<string, string> {
    const dailyScrumActivities = new Map<string, string>();

    if (person != null) {
      (Array.from(this.tasklets.values()).filter(t => {
        return t.type === TASKLET_TYPE.DAILY_SCRUM;
      }).sort((t1, t2) => {
        return (new Date(t1.creationDate) > new Date(t2.creationDate)) ? 1 : -1;
      }) as TaskletDailyScrum[]).forEach(t => {
        t.participants.filter(p => {
          return p.person.name === person.name;
        }).forEach(p => {
          p.activities.filter(a => {
            return a.topic.length !== 0;
          }).forEach(a => {
            dailyScrumActivities.set(a.topic, a.topic);
          });
        });
      });
    }

    return dailyScrumActivities;
  }

  //
  // Filters
  //

  // TODO Move to match service
  public matchesDate(tasklet: Tasklet, date: Date) {
    return new Date(tasklet.creationDate) > new Date(this.dateService.getDayStart(date))
      && new Date(tasklet.creationDate) < new Date(this.dateService.getDayEnd(date));
  }
}
