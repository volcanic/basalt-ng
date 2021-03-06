import {Injectable, isDevMode} from '@angular/core';
import {Tasklet} from '../../model/tasklet.model';
import {Subject} from 'rxjs';
import {Person} from '../../model/person.model';
import {TaskletType} from '../../model/tasklet-type.enum';
import {DateService} from '../date.service';
import {EntityType} from '../../model/entity-type.enum';
import {SuggestionService} from '../suggestion.service';
import {PouchDBService} from '../../../persistence/services/pouchdb.service';
import {TaskService} from '../task/task.service';
import {ProjectService} from '../project/project.service';
import {environment} from '../../../../../environments/environment';
import {ScopeService} from '../scope.service';
import {Scope} from '../../model/scope.enum';
import {TagService} from '../tag/tag.service';
import {PersonService} from '../person/person.service';
import {MeetingMinuteItemType} from '../../model/meeting-minutes/meeting-minute-item-type.enum';
import {MeetingMinuteItem} from '../../model/meeting-minutes/meeting-minute-item.model';
import {DailyScrumItem} from '../../model/daily-scrum/daily-scrum-item.model';
import {TaskletDisplayAspect, TaskletDisplayService} from './tasklet-display.service';
import {Description} from '../../model/description.model';
import {TaskletTypeGroup} from '../../model/tasklet-type-group.enum';
import {TaskletTypeService} from './tasklet-type.service';
import {DailyScrumItemType} from '../../model/daily-scrum/daily-scrum-item-type.enum';
import {Project} from '../../model/project.model';
import {Task} from '../../model/task.model';
import {SnackbarService} from '../../../ui/services/snackbar.service';
import {Tag} from '../../model/tag.model';

/**
 * Handles tasklets including
 * <li> Queries
 * <li> Persistence
 * <li> Lookup
 * <li> Display options
 */

/* tslint:disable:object-literal-key-quotes */
@Injectable({
  providedIn: 'root'
})
export class TaskletService {

  /** Name of default topic */
  static TOPIC_GENERAL = 'General';

  /** Subject that publishes tasklets */
  taskletsSubject = new Subject<Map<string, Tasklet>>();
  /** Subject that publishes a tasklet */
  taskletSubject = new Subject<Tasklet>();
  /** Subject that publishes dates scrolled by */
  dateQueueSubject = new Subject<Date>();

  /** Map of tasklets */
  private tasklets: Map<string, Tasklet>;
  /** Single tasklet */
  private tasklet: Tasklet;

  /**
   * Retrieves a task by a given tasklet
   * @param tasklet tasklet to find task by
   * @param tasksMap tasks map
   * @returns task referenced by given tasklet, null if no such task exists
   */
  static getTaskByTasklet(tasklet: Tasklet, tasksMap: Map<string, Task>): Task {
    if (tasklet != null && tasklet.taskId != null) {
      return tasksMap.get(tasklet.taskId);
    }

    return null;
  }

  /**
   * Retrieves a project by a given tasklet
   * @param tasklet tasklet to find project by
   * @param tasksMap tasks map
   * @param projectsMap projects map
   * @returns project referenced by given tasklet, null if no such project exists
   */
  static getProjectByTasklet(tasklet: Tasklet, tasksMap: Map<string, Task>, projectsMap: Map<string, Project>): Project {
    const task = TaskletService.getTaskByTasklet(tasklet, tasksMap);

    if (tasklet != null && task != null && task.projectId != null) {
      return projectsMap.get(task.projectId);
    }

    return null;
  }

  /**
   * Determines if a tasklet is defined by a task
   * @param task task
   */
  static isTaskletDefinedByTask(task: Task): boolean {
    return task != null && task.name != null && task.name !== '' && !task.proxy;
  }

  /**
   * Determines if a tasklet is defined by a project
   * @param project project
   */
  static isTaskletDefinedByProject(project: Project): boolean {
    return project != null && project.name != null && project.name !== '';
  }

  /**
   * Retrieves an icon by tasklet type
   * @param group tasklet type group
   */
  static getIconByTaskletTypeGroup(group: TaskletTypeGroup): string {
    return TaskletTypeService.getIconByTaskletTypeGroup(group);
  }

  /**
   * Retrieves an icon by tasklet type
   * @param type tasklet type
   */
  static getIconByTaskletType(type: TaskletType): string {
    return TaskletTypeService.getIconByTaskletType(type);
  }

  //
  // Sort
  //

  /**
   * Sorts tags by creation date
   * @param t1 tasklet
   * @param t2 tasklet
   */
  static sortTaskletsByCreationDate(t1: Tasklet, t2: Tasklet) {
    return new Date(t2.creationDate).getTime() - new Date(t1.creationDate).getTime();
  }

  /**
   * Constructor
   * @param dateService date service
   * @param personService person service
   * @param pouchDBService pouchDB service
   * @param projectService project service
   * @param snackbarService snackbar service
   * @param suggestionService suggestion service
   * @param scopeService scope service
   * @param taskletDisplayService tasklet display service
   * @param taskletTypeService tasklet type service
   * @param taskService task service
   * @param tagService tag service
   */
  constructor(private dateService: DateService,
              private personService: PersonService,
              private pouchDBService: PouchDBService,
              private projectService: ProjectService,
              private scopeService: ScopeService,
              private snackbarService: SnackbarService,
              private suggestionService: SuggestionService,
              private taskletDisplayService: TaskletDisplayService,
              private taskletTypeService: TaskletTypeService,
              private taskService: TaskService,
              private tagService: TagService) {
    this.initializeTaskletsSubscription();
    this.initializeTaskletSubscription();
  }

  //
  // Initialization
  //

  /**
   * Initializes tasklets subscription
   */
  private initializeTaskletsSubscription() {
    this.taskletsSubject.subscribe((value) => {
      this.tasklets = value as Map<string, Tasklet>;
      this.suggestionService.updateByTasklets(value as Map<string, Tasklet>);
    });
  }

  /**
   * Initializes tasklet subscription
   */
  private initializeTaskletSubscription() {
    this.taskletSubject.subscribe((value) => {
      this.tasklet = value as Tasklet;
    });
  }

  //
  // Fetch
  //

  /**
   * Fetches tasklets
   * @param forceReload force reload
   */
  public fetchTasklets(forceReload = false) {
    if (this.tasklets != null && !forceReload) {
      this.taskletsSubject.next(this.tasklets);
    } else {
      this.findTasklets();
    }
  }

  /**
   * Fetches tasklets by scope
   * @param scope scope to filter by
   * @param forceReload force reload
   */
  public fetchTaskletsByScope(scope: Scope, forceReload = false) {
    if (this.tasklets != null && !forceReload) {
      this.taskletsSubject.next(this.tasklets);
    } else {
      this.findTaskletsByScope(scope);
    }
  }

  /**
   * Fetches a tasklet by id
   * @param id ID of filter by
   * @param forceReload force reload
   */
  public fetchTaskletByID(id: string, forceReload = false) {
    if (this.tasklets != null && !forceReload) {
      this.taskletsSubject.next(this.tasklets);
    } else {
      this.findTaskletByID(id);
    }
  }

  //
  // Queries
  //

  /**
   * Loads tasklets by a given scope
   */
  private findTasklets() {
    const startDate = DateService.addDays(new Date(), -(environment.LIMIT_TASKLETS_DAYS));

    const index = {fields: ['entityType', 'creationDate']};
    const options = {
      selector: {
        '$and': [
          {entityType: {$eq: EntityType.TASKLET}},
          {creationDate: {$gt: startDate.toISOString()}}
        ]
      },
      // sort: [{creationDate: 'desc'}],
      limit: environment.LIMIT_TASKLETS_COUNT
    };

    this.findTaskletsInternal(index, options);
  }

  /**
   * Loads tasklets by a given scope
   * @param scope scope to filter by
   */
  private findTaskletsByScope(scope: Scope) {
    const startDate = DateService.addDays(new Date(), -(environment.LIMIT_TASKLETS_DAYS));

    const index = {fields: ['entityType', 'scope', 'creationDate']};
    const options = {
      selector: {
        '$and': [
          {entityType: {$eq: EntityType.TASKLET}},
          {scope: {$eq: scope}},
          {creationDate: {$gt: startDate.toISOString()}}
        ]
      },
      // sort: [{creationDate: 'desc'}],
      limit: environment.LIMIT_TASKLETS_COUNT
    };

    this.findTaskletsInternal(index, options);
  }

  /**
   * Loads tasklet by a given ID
   * @param id ID of filter by
   */
  private findTaskletByID(id: string) {
    const index = {fields: ['entityType', 'id', 'creationDate']};
    const options = {
      selector: {
        '$and': [
          {entityType: {$eq: EntityType.TASKLET}},
          {id: {$eq: id}}
        ]
      },
      // sort: [{creationDate: 'desc'}],
      limit: environment.LIMIT_TASKLETS_COUNT
    };

    this.findTaskletInternal(index, options);
  }

  /**
   * Index tasklets and queries them afterwards
   * @param index index to be used
   * @param options query options
   */
  private findTaskletsInternal(index: any, options: any) {
    this.pouchDBService.find(index, options).then(result => {
        if (result != null) {
          const tasklets = new Map<string, Tasklet>();

          result['docs'].forEach(element => {
            const tasklet = element as Tasklet;
            tasklets.set(tasklet.id, tasklet);
          });
          this.notifyTasklets(tasklets);
        }
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
        if (result != null) {
          result['docs'].forEach(element => {
            this.notifyTasklet(element as Tasklet);
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
   * Creates a new tasklet
   * @param tasklet tasklet to be created
   * @param taskletsMap tasklets map
   * @param tasksMap tasks map
   * @param projectsMap projects map
   * @param personsMap persons map
   * @param tagsMap tags map
   */
  public createTasklet(tasklet: Tasklet, taskletsMap: Map<string, Tasklet>, tasksMap: Map<string, Task>, projectsMap: Map<string, Project>,
                       personsMap: Map<string, Person>, tagsMap: Map<string, Tag>): Promise<any> {
    return new Promise(() => {
        if (tasklet != null) {
          tasklet.scope = this.scopeService.scope;

          // Updated related objects
          this.projectService.updateProject(TaskletService.getProjectByTasklet(tasklet, tasksMap, projectsMap), projectsMap).then(() => {
          });
          this.taskService.updateTask(TaskletService.getTaskByTasklet(tasklet, tasksMap), tasksMap, projectsMap, tagsMap).then(() => {
          });
          tasklet.tagIds.forEach(id => {
            const tag = tagsMap.get(id);
            this.tagService.updateTag(tag, tagsMap).then(() => {
            });
          });
          tasklet.personIds.forEach(id => {
            const person = personsMap.get(id);
            this.personService.updatePerson(person, personsMap).then(() => {
            });
          });

          // Create tasklet
          return this.pouchDBService.upsert(tasklet.id, tasklet).then(() => {
            taskletsMap.set(tasklet.id, tasklet);
            this.notifyTasklet(tasklet);
            this.notifyTasklets(taskletsMap);
          });
        }
      }
    );
  }

  /**
   * Updates an existing tasklet
   * @param tasklet tasklet to be updated
   * @param taskletsMap tasklets map
   * @param tasksMap tasks map
   * @param projectsMap projects map
   * @param personsMap persons map
   * @param tagsMap tags map
   */
  public updateTasklet(tasklet: Tasklet, taskletsMap: Map<string, Tasklet>, tasksMap: Map<string, Task>, projectsMap: Map<string, Project>,
                       personsMap: Map<string, Person>, tagsMap: Map<string, Tag>): Promise<any> {
    return new Promise(() => {
      if (tasklet != null) {

        // Updated related objects
        this.projectService.updateProject(TaskletService.getProjectByTasklet(tasklet, tasksMap, projectsMap), projectsMap).then(() => {
        });
        this.taskService.updateTask(TaskletService.getTaskByTasklet(tasklet, tasksMap), tasksMap, projectsMap, tagsMap).then(() => {
        });
        if (tasklet.tagIds != null) {
          tasklet.tagIds.forEach(id => {
            const tag = tagsMap.get(id);
            this.tagService.updateTag(tag, tagsMap).then(() => {
            });
          });
        }
        if (tasklet.personIds != null) {
          tasklet.personIds.forEach(id => {
            const person = personsMap.get(id);
            this.personService.updatePerson(person, personsMap).then(() => {
            });
          });
        }

        tasklet.modificationDate = new Date();

        // Update tasklet
        return this.pouchDBService.upsert(tasklet.id, tasklet).then(() => {
          taskletsMap.set(tasklet.id, tasklet);
          this.notifyTasklet(tasklet);
          this.notifyTasklets(taskletsMap);
        });
      }
    });
  }

  /**
   * Deletes a tasklet
   * @param tasklet tasklet to be deleted
   * @param taskletsMap tasklets map
   */
  public deleteTasklet(tasklet: Tasklet, taskletsMap: Map<string, Tasklet>): Promise<any> {
    return new Promise(() => {
      if (tasklet != null) {
        return this.pouchDBService.remove(tasklet.id).then(() => {
          taskletsMap.delete(tasklet.id);
          this.notifyTasklets(taskletsMap);
        }).catch((error) => {
          if (isDevMode()) {
            console.error(error);
          }
          this.snackbarService.showSnackbarWithAction('An error occurred during deletion', 'RETRY', () => {
            this.deleteTasklet(tasklet, taskletsMap).then(() => {
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
   * Retrieves a list of tasklets that are associated with a given task
   * @param task task
   * @param taskletsMap tasklets map
   */
  public getTaskletsByTask(task: Task, taskletsMap: Map<string, Tasklet>): Tasklet[] {
    return (taskletsMap != null) ? Array.from(taskletsMap.values()).filter(tasklet => {
      return tasklet != null && task != null && tasklet.taskId === task.id;
    }).sort((t1, t2) => {
      return (new Date(t1.creationDate) > new Date(t2.creationDate)) ? 1 : -1;
    }).reverse() : [];
  }


  /**
   * Returns a map of recent daily scrum activities of a given type and a given person
   * @param taskletsMap tasklets map
   * @param type daily scrum item type
   * @param person person to get scrum activities for
   * @returns map of scrum activities
   */
  public getDailyScrumActivities(taskletsMap: Map<string, Tasklet>, type: DailyScrumItemType, person: Person): Map<string, string> {
    const dailyScrumActivities = new Map<string, string>();

    (Array.from(taskletsMap.values()).filter(t => {
      return t.type === TaskletType.DAILY_SCRUM;
    }).sort((t1, t2) => {
      return (new Date(t1.creationDate) > new Date(t2.creationDate)) ? 1 : -1;
    })).forEach(t => {
      t.dailyScrumItems.filter(dailyScrumItem => {
        return dailyScrumItem.type === type;
      }).filter(dailyScrumItem => {
        return person == null || (dailyScrumItem.person != null && dailyScrumItem.person.name === person.name);
      }).forEach(dailyScrumItem => {
        dailyScrumActivities.set(dailyScrumItem.statement, dailyScrumItem.statement);
      });
    });

    return dailyScrumActivities;
  }

  /**
   * Determines if a given date is the last of its week
   * @param tasklet tasklet
   * @param taskletsMap tasklets map
   */
  public isLastOfWeek(tasklet: Tasklet, taskletsMap: Map<string, Tasklet>): boolean {
    const taskletsOfWeek = Array.from(taskletsMap.values()).filter(t => {
      return DateService.isInWeek(t.creationDate, tasklet.creationDate);
    });

    return taskletsOfWeek != null
      && taskletsOfWeek.length > 0
      && taskletsOfWeek.sort(TaskletService.sortTaskletsByCreationDate)[0].id === tasklet.id;
  }

  /**
   * Determines if a given date is the last of its day
   * @param tasklet tasklet
   * @param taskletsMap tasklets map
   */
  public isLastOfDay(tasklet: Tasklet, taskletsMap: Map<string, Tasklet>): boolean {
    const taskletsOfDay = Array.from(taskletsMap.values()).filter(t => {
      return DateService.isInDay(t.creationDate, tasklet.creationDate);
    });

    return taskletsOfDay != null
      && taskletsOfDay.length > 0
      && taskletsOfDay.sort(TaskletService.sortTaskletsByCreationDate)[0].id === tasklet.id;
  }

  //
  // Helpers
  //

  /**
   * Adds a creation date of a tasklet to the queue and publishes the latest entry.
   * This is used for the date indicator component
   * @param date element to be added
   * @param delay delay
   */
  addElementToDateQueue(date: Date, delay: number) {
    setTimeout(() => {
      const BUFFER = 7;

      let dateQueue = [];
      dateQueue.push(date);

      // Evict queue
      if (dateQueue.length > BUFFER) {
        dateQueue = dateQueue.slice(dateQueue.length - BUFFER);
      }

      // Sort queue values
      const sortedDateQueue = dateQueue.slice().sort((d1: Date, d2: Date) => {
        return new Date(d2).getTime() - new Date(d1).getTime();
      });

      this.dateQueueSubject.next(sortedDateQueue[0]);
    }, delay);
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

  //
  // Delegated: Display aspects
  //

  /**
   * Determines if a given tasklet contains a display aspect
   * @param displayAspect display aspect
   * @param tasklet tasklet
   * @param task tasks
   * @param project project
   * @param previousDescription previous description
   */
  public containsDisplayAspect(displayAspect: TaskletDisplayAspect, tasklet: Tasklet, task?: Task, project?: Project, previousDescription?: Description): boolean {
    switch (displayAspect) {
      case TaskletDisplayAspect.CAN_BE_ASSIGNED_TO_TASK: {
        return this.taskletDisplayService.canBeAssignedToTask(tasklet);
      }
      case TaskletDisplayAspect.CONTAINS_DESCRIPTION: {
        return TaskletDisplayService.containsDescription(tasklet);
      }
      case TaskletDisplayAspect.CONTAINS_PREVIOUS_DESCRIPTION: {
        return TaskletDisplayService.containsPreviousDescription(previousDescription);
      }
      case TaskletDisplayAspect.CONTAINS_MEETING_MINUTES: {
        return TaskletDisplayService.containsMeetingMinutes(tasklet);
      }
      case TaskletDisplayAspect.CONTAINS_DAILY_SCRUM: {
        return TaskletDisplayService.containsDailyScrum(tasklet);
      }
      case TaskletDisplayAspect.CONTAINS_POMODORO_TASK: {
        return TaskletDisplayService.containsPomodoroTask(tasklet);
      }
      case TaskletDisplayAspect.CONTAINS_CHECKLIST: {
        return TaskletDisplayService.containsChecklist(tasklet);
      }
      case TaskletDisplayAspect.CONTAINS_TAGS: {
        return TaskletDisplayService.containsTags(tasklet);
      }
      case TaskletDisplayAspect.CONTAINS_PERSONS: {
        return TaskletDisplayService.containsPersons(tasklet);
      }
      case TaskletDisplayAspect.CAN_BE_CREATED: {
        return this.taskletDisplayService.canBeCreated(tasklet, task, project);
      }
      case TaskletDisplayAspect.CAN_BE_UPDATED: {
        return this.taskletDisplayService.canBeUpdated(tasklet, task, project);
      }
      case TaskletDisplayAspect.CAN_BE_CONTINUED: {
        return this.taskletDisplayService.canBeContinued(tasklet, task, project);
      }
      case TaskletDisplayAspect.CAN_BE_TEMPLATED: {
        return this.taskletDisplayService.canBeContinued(tasklet, task, project);
      }
      case TaskletDisplayAspect.IS_POMODORO_STARTED: {
        return TaskletDisplayService.isPomodoroStarted(tasklet);
      }
      case TaskletDisplayAspect.IS_DISPLAYED_AS_PREVIEW: {
        return this.taskletDisplayService.isDisplayedAsPreview(tasklet);
      }
    }

    return false;
  }

  //
  // Delegated: tasklet types
  //

  /**
   * Returns a list of tasklet types contained in a given tasklet type group
   * @param group tasklet type group
   */
  public getTaskletTypesByGroup(group: TaskletTypeGroup): TaskletType[] {
    return this.taskletTypeService.getTaskletTypesByGroup(group);
  }

  /**
   * Returns the tasklet type group of a given tasklet type
   * @param type tasklet type
   */
  public getTaskletGroupByType(type: TaskletType): TaskletTypeGroup {
    return this.taskletTypeService.getTaskletGroupByType(type);
  }

  /**
   * Determines if a tasklet type group contains a given tasklet type
   * @param group tasklet type group
   * @param type tasklet type
   */
  public groupContainsType(group: TaskletTypeGroup, type: TaskletType) {
    return this.taskletTypeService.groupContainsType(group, type);
  }

  //
  // Notification
  //

  /**
   * Informs subscribers that something has changed
   * @param tasklet tasklet
   */
  public notifyTasklet(tasklet: Tasklet) {
    this.taskletSubject.next(tasklet);
  }

  /**
   * Informs subscribers that something has changed
   * @param taskletsMap tasklets map
   */
  public notifyTasklets(taskletsMap: Map<string, Tasklet>) {
    this.taskletsSubject.next(taskletsMap);
  }
}
