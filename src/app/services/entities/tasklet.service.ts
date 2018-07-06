import {Injectable} from '@angular/core';
import {Tasklet} from '../../model/entities/tasklet.model';
import {Subject} from 'rxjs';
import {Person} from '../../model/person.model';
import {TASKLET_TYPE} from '../../model/tasklet-type.enum';
import {TaskletDailyScrum} from '../../model/tasklet-daily-scrum.model';
import {Project} from '../../model/entities/project.model';
import {Task} from '../../model/entities/task.model';
import {Tag} from '../../model/tag.model';
import {DateService} from '../date.service';
import {EntityService} from './entity.service';
import {EntityType} from '../../model/entities/entity-type.enum';
import {takeUntil} from 'rxjs/internal/operators';
import {Entity} from '../../model/entities/entity.model';

@Injectable()
export class TaskletService {
  tasklets = new Map<string, Tasklet>();
  taskletsSubject = new Subject<Tasklet[]>();

  private entitiesUnsubscribeSubject = new Subject();

  searchItems = [];
  tags: Map<string, Tag>;
  persons: Map<string, Person>;

  constructor(private entityService: EntityService,
              private dateService: DateService) {
    this.entityService.entitiesSubject.pipe(
      takeUntil(this.entitiesUnsubscribeSubject)
    ).subscribe((value) => {
      (value as Entity[]).forEach(entity => {

          if (entity.entityType === EntityType.TASKLET) {
            const tasklet = entity as Tasklet;
            this.tasklets.set(tasklet.id, tasklet);
          }
        }
      );

      this.updateSearchItems();
      this.updateTags();
      this.updatePersons();
      this.notify();
    });
  }

  //
  // Persistence
  //

  public createTasklet(tasklet: Tasklet) {
    this.entityService.createEntity(tasklet);
    this.tasklets.set(tasklet.id, tasklet);
    this.notify();
  }

  public updateTasklet(tasklet: Tasklet) {
    this.entityService.updateEntity(tasklet);
    this.tasklets.set(tasklet.id, tasklet);
    this.notify();
  }

  public deleteTasklet(tasklet: Tasklet) {
    this.entityService.deleteEntity(tasklet);
    this.tasklets.delete(tasklet.id);
    this.notify();
  }

  /**
   * Informs subscribers that something has changed
   */
  public notify() {
    this.taskletsSubject.next(Array.from(this.tasklets.values()).sort((t1: Tasklet, t2: Tasklet) => {
      const date1 = new Date(t1.creationDate).getTime();
      const date2 = new Date(t2.creationDate).getTime();

      return date2 - date1;
    }));
  }

  //
  // Lookup
  //

  /**
   * Updates search items
   */
  public updateSearchItems() {
    this.searchItems = [];

    Array.from(this.tasklets.values()).sort((t1, t2) => {
      return (new Date(t1.creationDate) > new Date(t2.creationDate)) ? 1 : -1;
    }).forEach(t => {
      if (t != null) {

        // Add description lines to search items
        if (t.description.value != null) {
          t.description.value.split('\n').forEach(v => {
            if (v.trim() !== '') {
              this.searchItems.push(v.trim().replace(/(^-)/g, ''));
            }
          });
        }

        // Add tags to search items
        if (t.tags != null) {
          t.tags.forEach(tag => {
            this.searchItems.push(tag.name);
          });
        }

        // Add persons to search items
        if (t.persons != null) {
          t.persons.forEach(person => {
            this.searchItems.push(person.name);
          })
        }

        // Add tasklet name to search items
        const task: Task = this.entityService.getEntityById(t.taskId) as Task;
        if (task != null) {
          this.searchItems.push(task.name.trim().replace(/(^-)/g, ''));

          // Add project name to search items
          const project: Project = this.entityService.getEntityById(task.projectId) as Project;
          if (project != null) {
            this.searchItems.push(project.name.trim().replace(/(^-)/g, ''));
          }
        }
      }
    });
  }

  /**
   * Updates tags
   */
  public updateTags() {
    this.tags = new Map<string, Tag>();

    Array.from(this.tasklets.values()).sort((t1, t2) => {
      return (new Date(t1.creationDate) > new Date(t2.creationDate)) ? -1 : 1;
    }).forEach(tasklet => {
      if (tasklet.tags != null) {
        tasklet.tags.forEach(t => {
          if (t != null && t.name != null && t.name.length > 0) {
            // Deep copy
            const tag = new Tag(t.name, t.checked);
            this.tags.set(tag.name, tag);
          }
        });
      }
    });
  }

  /**
   * Updates persons
   */
  public updatePersons() {
    this.persons = new Map<string, Tag>();

    Array.from(Array.from(this.tasklets.values()).values()).sort((t1, t2) => {
      return (new Date(t1.creationDate) > new Date(t2.creationDate)) ? -1 : 1;
    }).forEach(tasklet => {
      if (tasklet.persons != null) {
        tasklet.persons.forEach(p => {
          if (p != null && p.name != null && p.name.length > 0) {
            // Deep copy
            const person = new Person(p.name);
            this.persons.set(person.name, person);
          }
        });
      }
    });
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

  /**
   * Returns a map of persons
   * @returns {Map<string, Person>}
   */
  public getPersons(): Map<string, Person> {
    const persons = new Map<string, Person>();

    Array.from(this.tasklets.values()).sort((t1, t2) => {
      return (new Date(t1.creationDate) > new Date(t2.creationDate)) ? -1 : 1;
    }).forEach(t => {
      if (t.persons != null) {
        t.persons.forEach(p => {
          persons.set(p.name, p);
        });
      }
    });

    return persons;
  }

  //
  // Filters
  //

  public matchesDate(tasklet: Tasklet, date: Date) {
    return new Date(tasklet.creationDate) > new Date(this.dateService.getDayStart(date))
      && new Date(tasklet.creationDate) < new Date(this.dateService.getDayEnd(date));
  }
}
