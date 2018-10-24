import {Injectable, isDevMode} from '@angular/core';
import {Tasklet} from '../model/tasklet.model';
import {Subject} from 'rxjs';
import {Person} from '../model/person.model';
import {TaskletType} from '../model/tasklet-type.enum';
import {DateService} from './date.service';
import {EntityType} from '../model/entity-type.enum';
import {SuggestionService} from './suggestion.service';
import {PouchDBService} from '../../persistence/services/pouchdb.service';
import {Project} from '../model/project.model';
import {Task} from '../model/task.model';
import {TaskService} from './task.service';
import {ProjectService} from './project.service';
import {environment} from '../../../../environments/environment';
import {SnackbarService} from '../../ui/services/snackbar.service';
import {ScopeService} from './scope.service';
import {Scope} from '../model/scope.enum';
import {TagService} from './tag.service';
import {PersonService} from './person.service';
import {MeetingMinuteItemType} from '../model/meeting-minutes/meeting-minute-item-type.enum';
import {MeetingMinuteItem} from '../model/meeting-minutes/meeting-minute-item.model';
import {DailyScrumItem} from '../model/daily-scrum/daily-scrum-item.model';

/**
 * Handles tasklets including
 * <li> Queries
 * <li> Persistence
 * <li> Lookup
 */
@Injectable({
  providedIn: 'root'
})
export class TaskletService {

  /** Name of default topic */
  static TOPIC_GENERAL = 'General';

  /** Map of all tasklets */
  tasklets = new Map<string, Tasklet>();
  /** Subject that publishes tasklets */
  taskletsSubject = new Subject<Tasklet[]>();

  /** Tasklet in focus */
  tasklet: Tasklet;
  /** Subject that publishes tasklet */
  taskletSubject = new Subject<Tasklet>();

  /** Queue containing recent dates scrolled by */
  dateQueue = [];
  /** Subject that publishes dates scrolled by */
  dateQueueSubject = new Subject<Date>();

  /**
   * Constructor
   * @param {PouchDBService} pouchDBService
   * @param {ProjectService} projectService
   * @param {TaskService} taskService
   * @param {TagService} tagService
   * @param {PersonService} personService
   * @param {DateService} dateService
   * @param {SuggestionService} suggestionService
   * @param {SnackbarService} snackbarService
   * @param {ScopeService} scopeService
   */
  constructor(private pouchDBService: PouchDBService,
              private projectService: ProjectService,
              private taskService: TaskService,
              private tagService: TagService,
              private personService: PersonService,
              private dateService: DateService,
              private suggestionService: SuggestionService,
              private snackbarService: SnackbarService,
              private scopeService: ScopeService) {
    this.initializeTaskletSubscription();
    this.findTaskletsByScope(this.scopeService.scope);
  }

  //
  // Initialization
  //

  // <editor-fold desc="Initialization">

  /**
   * Initializes tasklet subscription
   */
  private initializeTaskletSubscription() {
    this.taskletsSubject.subscribe((value) => {
      (value as Tasklet[]).forEach(tasklet => {
          this.tasklets.set(tasklet.id, tasklet);
        }
      );

      this.suggestionService.updateByTasklets(Array.from(this.tasklets.values()));
    });
  }

  // </editor-fold>

  //
  // Queries
  //

  // <editor-fold desc="Queries">

  /**
   * Loads tasklets by a given scope
   * @param {Scope} scope scope to filter by
   */
  public findTaskletsByScope(scope: Scope) {
    const index = {fields: ['entityType', 'scope', 'creationDate']};
    const options = {
      selector: {
        '$and': [
          {entityType: {$eq: EntityType.TASKLET}},
          {creationDate: {$gt: '2018-08-01T00:00:00.000Z'}}
        ]
      },
      // sort: [{creationDate: 'desc'}],
      limit: environment.LIMIT_TASKLETS
    };

    this.clearTasklets();
    this.findTaskletsInternal(index, options);
  }

  /**
   * Loads tasklet by a given ID
   * @param {number} id ID of filter by
   */
  public findTaskletByID(id: string) {
    const index = {fields: ['entityType', 'id', 'creationDate']};
    const options = {
      selector: {
        '$and': [
          {entityType: {$eq: EntityType.TASKLET}},
          {id: {$eq: id}}
        ]
      },
      // sort: [{creationDate: 'desc'}],
      limit: environment.LIMIT_TASKLETS
    };

    this.findTaskletInternal(index, options);
  }

  /**
   * Clears tasklets
   */
  private clearTasklets() {
    this.tasklets.clear();
  }

  /**
   * Index tasklets and queries them afterwards
   * @param index index to be used
   * @param options query options
   */
  private findTaskletsInternal(index: any, options: any) {
    this.pouchDBService.find(index, options).then(result => {
        result['docs'].forEach(element => {
          const tasklet = element as Tasklet;
          this.tasklets.set(tasklet.id, tasklet);
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
   * Index tasklets and queries them afterwards
   * @param index index to be used
   * @param options query options
   */
  private findTaskletInternal(index: any, options: any) {
    this.pouchDBService.find(index, options).then(result => {
        result['docs'].forEach(element => {
          this.tasklet = element as Tasklet;
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
   * Creates a new tasklet
   * @param {Tasklet} tasklet tasklet to be created
   */
  public createTasklet(tasklet: Tasklet): Promise<any> {
    return new Promise(() => {
        if (tasklet != null) {
          tasklet.scope = this.scopeService.scope;

          // Updated related objects
          this.projectService.updateProject(this.getProjectByTasklet(tasklet), false).then(() => {
          });
          this.taskService.updateTask(this.getTaskByTasklet(tasklet), false).then(() => {
          });
          tasklet.tagIds.forEach(id => {
            const tag = this.tagService.getTagById(id);
            this.tagService.updateTag(tag, false).then(() => {
            });
          });
          tasklet.personIds.forEach(id => {
            const person = this.personService.getPersonById(id);
            this.personService.updatePerson(person, false).then(() => {
            });
          });

          // Create tasklet
          return this.pouchDBService.upsert(tasklet.id, tasklet).then(() => {
            this.snackbarService.showSnackbar('Added tasklet');
            this.tasklets.set(tasklet.id, tasklet);
            this.notify();
          });
        }
      }
    );
  }

  /**
   * Updates an existing tasklet
   * @param {Tasklet} tasklet tasklet to be updated
   */
  public updateTasklet(tasklet: Tasklet): Promise<any> {
    return new Promise(() => {
      if (tasklet != null) {

        // Updated related objects
        this.projectService.updateProject(this.getProjectByTasklet(tasklet), false).then(() => {
        });
        this.taskService.updateTask(this.getTaskByTasklet(tasklet), false).then(() => {
        });
        if (tasklet.tagIds != null) {
          tasklet.tagIds.forEach(id => {
            const tag = this.tagService.getTagById(id);
            this.tagService.updateTag(tag, false).then(() => {
            });
          });
        }
        if (tasklet.personIds != null) {
          tasklet.personIds.forEach(id => {
            const person = this.personService.getPersonById(id);
            this.personService.updatePerson(person, false).then(() => {
            });
          });
        }

        tasklet.modificationDate = new Date();

        // Update tasklet
        return this.pouchDBService.upsert(tasklet.id, tasklet).then(() => {
          this.snackbarService.showSnackbar('Updated tasklet');
          this.tasklets.set(tasklet.id, tasklet);
          this.tasklet = tasklet;
          this.notify();
        });
      }
    });
  }

  /**
   * Deletes a tasklet
   * @param {Tasklet} tasklet tasklet to be deleted
   */
  public deleteTasklet(tasklet: Tasklet): Promise<any> {
    return new Promise(() => {
      if (tasklet != null) {
        return this.pouchDBService.remove(tasklet.id, tasklet).then(() => {
          this.snackbarService.showSnackbar('Deleted tasklet');
          this.tasklets.delete(tasklet.id);
          this.notify();
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
   * Retrieves a task by a given tasklet
   * @param {Tasklet} tasklet tasklet to find task by
   * @returns {Task} task referenced by given tasklet, null if no such task exists
   */
  public getTaskByTasklet(tasklet: Tasklet): Task {
    if (tasklet != null && tasklet.taskId != null) {
      return this.taskService.tasks.get(tasklet.taskId);
    }

    return null;
  }

  /**
   * Retrieves a project by a given tasklet
   * @param {Tasklet} tasklet tasklet to find project by
   * @returns {Project} project referenced by given tasklet, null if no such project exists
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
   * @param {Person} person person to get scrum activities for
   * @returns {Map<string, string>} map of scrum activities
   */
  public getDailyScrumActivities(person: Person): Map<string, string> {
    const dailyScrumActivities = new Map<string, string>();

    if (person != null) {
      (Array.from(this.tasklets.values()).filter(t => {
        return t.type === TaskletType.DAILY_SCRUM;
      }).sort((t1, t2) => {
        return (new Date(t1.creationDate) > new Date(t2.creationDate)) ? 1 : -1;
      })).forEach(t => {
        t.dailyScrumItems.filter(d => {
          if (d.person != null && d.person.name === person.name) {
            dailyScrumActivities.set(d.statement, d.statement);
          }
        });
      });
    }

    return dailyScrumActivities;
  }

  // </editor-fold>

  //
  // Helpers
  //

  // <editor-fold desc="Util">

  /**
   * Adds a creation date of a tasklet to the queue and publishes the latest entry.
   * This is used for the date indicator component
   * @param {Date} date element to be added
   */
  addElementToDateQueue(date: Date) {
    const BUFFER = 7;

    this.dateQueue.push(date);

    // Evict queue
    if (this.dateQueue.length > BUFFER) {
      this.dateQueue = this.dateQueue.slice(this.dateQueue.length - BUFFER);
    }

    // Sort queue values
    const sortedDateQueue = this.dateQueue.slice().sort((d1: Date, d2: Date) => {
      return new Date(d2).getTime() - new Date(d1).getTime();
    });

    this.dateQueueSubject.next(sortedDateQueue[0]);
  }

  /**
   * Determines a list of topics
   *
   * @param tasklet tasklet to get topics of
   */
  public getTopics(tasklet: Tasklet) {
    const topicsMap = new Map<string, string>();

    if (tasklet != null && tasklet.meetingMinuteItems != null) {
      tasklet.meetingMinuteItems.forEach(m => {
        const topic = (m.type !== MeetingMinuteItemType.TOPIC && m.topic != null)
          ? m.topic : TaskletService.TOPIC_GENERAL;
        topicsMap.set(topic, topic);
      });

      return Array.from(topicsMap.values());
    }

    return [];
  }

  /**
   * Returns list of meeting minutes by topic
   * @param tasklet tasklet
   * @param topic topic
   */
  public getMeetingMinuteItemsByTopic(tasklet: Tasklet, topic: string): MeetingMinuteItem[] {
    return tasklet.meetingMinuteItems.filter(m => {
      return (m.topic === topic
        || (m.topic === null && topic === TaskletService.TOPIC_GENERAL));
    }).sort((m1, m2) => {
      return new Date(m2.date).getTime() < new Date(m1.date).getTime() ? 1 : -1;
    }).sort((a, b) => {
      if (a.type < b.type) {
        return 1;
      }
      if (a.type > b.type) {
        return -1;
      }
      return 0;
    });
  }

  /**
   * Determines a list of participants
   *
   * @param tasklet tasklet to get participants of
   */
  public getParticipants(tasklet: Tasklet) {
    const participantsMap = new Map<string, string>();

    if (tasklet != null && tasklet.dailyScrumItems != null) {
      tasklet.dailyScrumItems.forEach(d => {
        participantsMap.set(d.person.name, d.person.name);
      });

      return Array.from(participantsMap.values());
    }

    return [];
  }

  /**
   * Returns list of daily scrum activities by participant
   * @param tasklet tasklet
   * @param participant participant
   */
  public getDailyScrumActivitiesByParticipant(tasklet: Tasklet, participant: string): DailyScrumItem[] {
    return tasklet.dailyScrumItems.filter(m => {
      return (m.person.name === participant);
    }).sort((m1, m2) => {
      return new Date(m2.date).getTime() < new Date(m1.date).getTime() ? 1 : -1;
    }).sort((a, b) => {
      if (a.type < b.type) {
        return 1;
      }
      if (a.type > b.type) {
        return -1;
      }
      return 0;
    });
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
    this.taskletSubject.next(this.tasklet);
    this.taskletsSubject.next(Array.from(this.tasklets.values()).sort((t1, t2) => {
      return new Date(t2.creationDate).getTime() - new Date(t1.creationDate).getTime();
    }));
  }

  // </editor-fold>
}
