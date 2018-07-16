import {Injectable} from '@angular/core';
import {Tasklet} from '../../model/entities/tasklet.model';
import {Subject} from 'rxjs';
import {Person} from '../../model/person.model';
import {TASKLET_TYPE} from '../../model/tasklet-type.enum';
import {TaskletDailyScrum} from '../../model/tasklet-daily-scrum.model';
import {DateService} from '../date.service';
import {EntityService} from './entity.service';
import {EntityType} from '../../model/entities/entity-type.enum';
import {takeUntil} from 'rxjs/internal/operators';
import {Entity} from '../../model/entities/entity.model';
import {SuggestionService} from '../suggestion.service';

@Injectable()
export class TaskletService {
  tasklets = new Map<string, Tasklet>();
  taskletsSubject = new Subject<Tasklet[]>();

  private entitiesUnsubscribeSubject = new Subject();

  constructor(private entityService: EntityService,
              private dateService: DateService,
              private suggestionService: SuggestionService) {

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

      this.suggestionService.updateByTasklets(Array.from(this.tasklets.values()));
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
