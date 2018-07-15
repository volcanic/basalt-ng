import {Injectable} from '@angular/core';
import {Task} from '../../model/entities/task.model';
import {Subject} from 'rxjs/Subject';
import {EntityService} from './entity.service';
import {Entity} from '../../model/entities/entity.model';
import {takeUntil} from 'rxjs/internal/operators';
import {EntityType} from '../../model/entities/entity-type.enum';
import {Tag} from '../../model/tag.model';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  tasks = new Map<string, Task>();
  tasksSubject = new Subject<Task[]>();
  tags: Map<string, Tag>;

  private entitiesUnsubscribeSubject = new Subject();

  constructor(private entityService: EntityService) {
    this.entityService.entitiesSubject.pipe(
      takeUntil(this.entitiesUnsubscribeSubject)
    ).subscribe((value) => {
      (value as Entity[]).forEach(entity => {

          if (entity.entityType === EntityType.TASK) {
            const task = entity as Task;
            this.tasks.set(task.id, task);
          }
        }
      );

      this.notify();
    });
  }

  //
  // Persistence
  //

  public createTask(task: Task) {
    this.entityService.createEntity(task);
    this.tasks.set(task.id, task);
    this.notify();
  }

  public updateTask(task: Task) {
    this.entityService.updateEntity(task);
    this.tasks.set(task.id, task);
    this.notify();
  }

  public deleteTask(task: Task) {
    this.entityService.deleteEntity(task);
    this.tasks.delete(task.id);
    this.notify();
  }

  /**
   * Informs subscribers that something has changed
   */
  public notify() {
    this.tasksSubject.next(Array.from(this.tasks.values()).sort((t1: Task, t2: Task) => {
      const date1 = new Date(t1.creationDate).getTime();
      const date2 = new Date(t2.creationDate).getTime();

      return date2 - date1;
    }));
  }

  //
  // Lookup
  //

  public getTaskByName(name: string): Task {
    let task: Task;

    Array.from(this.tasks.values()).forEach(t => {
      if (t.name === name) {
        task = t;
      }
    });

    return task;
  }

  updateTags() {
    this.tags = new Map<string, Tag>();

    Array.from(this.tasks.values()).sort((t1, t2) => {
      return (new Date(t1.creationDate) > new Date(t2.creationDate)) ? -1 : 1;
    }).forEach(task => {
      if (task.tags != null) {
        task.tags.forEach(t => {
          if (t != null && t.name != null && t.name.length > 0) {
            // Deep copy
            const tag = new Tag(t.name, t.checked);
            this.tags.set(tag.name, tag);
          }
        });
      }
    });
  }
}
