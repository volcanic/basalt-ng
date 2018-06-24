import {Injectable} from '@angular/core';
import {Task} from '../../model/entities/task.model';
import {Subject} from 'rxjs/Rx';
import {EntityService} from './entity.service';
import {Entity} from '../../model/entities/entity.model';
import {takeUntil} from 'rxjs/internal/operators';
import {EntityType} from '../../model/entities/entity-type.enum';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  tasks = new Map<string, Task>();
  tasksSubject = new Subject<Task[]>();

  private entitiesUnsubscribeSubject = new Subject();

  constructor(private entityService: EntityService) {
    this.entityService.entitiesSubject.pipe(
      takeUntil(this.entitiesUnsubscribeSubject)
    ).subscribe((value) => {
      (value as Entity[]).forEach(entity => {

          if (entity.entityType === EntityType.TASK) {
            const task = entity as Task;
            this.tasks.set(task.id, task);
            console.debug(`DEBUG subscribe task ${JSON.stringify(task)}`);
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
}
