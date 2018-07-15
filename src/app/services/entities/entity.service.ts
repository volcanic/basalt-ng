import {Injectable, isDevMode} from '@angular/core';
import {PouchDBService} from '../pouchdb.service';
import {Project} from '../../model/entities/project.model';
import {Subject} from 'rxjs/Subject';
import {Tasklet} from '../../model/entities/tasklet.model';
import {Task} from '../../model/entities/task.model';
import {EntityType} from '../../model/entities/entity-type.enum';
import {Entity} from '../../model/entities/entity.model';

@Injectable({
  providedIn: 'root'
})
export class EntityService {

  // TODO add separate lists for each type

  entities = new Map<string, Entity>();
  entitiesSubject = new Subject<Entity[]>();

  constructor(private pouchDBService: PouchDBService) {
    this.pouchDBService.getChangeListener().subscribe(
      item => {
        (item['change']['docs']).forEach(d => {
          const entity = d as Entity;
          const entityType = entity.entityType;

          if (entityType === EntityType.PROJECT) {
            const project = entity as Project;
            this.entities.set(project.id, project);
          } else if (entityType === EntityType.TASK) {
            const task = entity as Task;
            this.entities.set(task.id, task);
          } else if (entityType === EntityType.TASKLET) {
            const tasklet = entity as Tasklet;
            this.entities.set(tasklet.id, tasklet);
          }

          this.notify();
        });
      });
  }

  /**
   * Retrieves data from PouchDB
   */
  public fetch() {
    this.entities.clear();
    this.pouchDBService.fetch().then(result => {
        result.rows.forEach(d => {
          const entity = d['doc'] as Entity;
          const entityType = entity.entityType;

          if (entityType === EntityType.PROJECT) {
            const project = entity as Project;
            this.entities.set(project.id, project);
          } else if (entityType === EntityType.TASK) {
            const task = entity as Task;
            this.entities.set(task.id, task);
          } else if (entityType === EntityType.TASKLET) {
            const tasklet = entity as Tasklet;
            this.entities.set(tasklet.id, tasklet);
          }
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

  public createEntity(entity: Entity) {
    console.log(`DEBUG createEntity ${JSON.stringify(entity)}`);
    this.entities.set(entity.id, entity);
    this.pouchDBService.put(entity.id, entity);
    this.notify();
  }

  public updateEntity(entity: Entity) {
    console.log(`DEBUG updateEntity ${entity.id}`);
    this.entities.set(entity.id, entity);
    this.pouchDBService.put(entity.id, entity);
    this.notify();
  }

  public deleteEntity(entity: Entity) {
    console.log(`DEBUG deleteEntity ${entity.id}`);
    this.entities.delete(entity.id);
    this.pouchDBService.remove(entity.id, entity);
    this.notify();
  }

  /**
   * Informs subscribers that something has changed
   */
  public notify() {
    this.entitiesSubject.next(Array.from(this.entities.values()));
  }

  //
  // Import/Export
  //

  public downloadEntities() {
    const fileContents = JSON.stringify(Array.from(this.entities.values()));
    const filename = 'entities.basalt';
    // const filetype = 'text/plain';

    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(fileContents));
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  }

  /*
  public showEntities() {
    const fileContents = JSON.stringify(Array.from(this.entities.values()));
    // const filename = 'entities.basalt';
    const filetype = 'text/plain';

    const blob = new Blob([fileContents], {type: filetype});
    const url = window.URL.createObjectURL(blob);
    window.open(url);
  }
  */

  //
  // Lookup
  //

  /**
   * Retrieves an entity by its ID
   *
   * @param id
   * @returns {undefined|Entity}
   */
  public getEntityById(id: string): Entity {
    return this.entities.get(id);
  }

  /**
   * Retrieves a tasklet by a tasks
   *
   * @param tasklet
   * @returns {any}
   */
  public getTaskByTasklet(tasklet: Tasklet): Task {
    if (tasklet != null && tasklet.taskId != null) {
      return this.getEntityById(tasklet.taskId) as Task;
    }

    return null;
  }

  /**
   * Retrieves a project by a tasks
   *
   * @param tasklet
   * @returns {any}
   */
  public getProjectByTasklet(tasklet: Tasklet): Project {
    const task = this.getTaskByTasklet(tasklet);

    if (tasklet != null && task != null && task.projectId != null) {
      return this.getEntityById(task.projectId) as Project;
    }

    return null;
  }
}
