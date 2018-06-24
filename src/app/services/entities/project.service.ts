import {Injectable} from '@angular/core';
import {Project} from '../../model/entities/project.model';
import {Subject} from 'rxjs/Rx';
import {EntityService} from './entity.service';
import {takeUntil} from 'rxjs/internal/operators';
import {Entity} from '../../model/entities/entity.model';
import {EntityType} from '../../model/entities/entity-type.enum';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  projects = new Map<string, Project>();
  projectsSubject = new Subject<Project[]>();

  private entitiesUnsubscribeSubject = new Subject();

  constructor(private entityService: EntityService) {
    this.entityService.entitiesSubject.pipe(
      takeUntil(this.entitiesUnsubscribeSubject)
    ).subscribe((value) => {
      (value as Entity[]).forEach(entity => {

          if (entity.entityType === EntityType.PROJECT) {
            const project = entity as Project;
            this.projects.set(project.id, project);
          }
        }
      );

      this.notify();
    });
  }

  //
  // Persistence
  //

  public createProject(project: Project) {
    this.entityService.createEntity(project);
    this.projects.set(project.id, project);
    this.notify();
  }

  public updateProject(project: Project) {
    this.entityService.updateEntity(project);
    this.projects.set(project.id, project);
    this.notify();
  }

  public deleteProject(project: Project) {
    this.entityService.deleteEntity(project);
    this.projects.delete(project.id);
    this.notify();
  }


  /**
   * Informs subscribers that something has changed
   */
  public notify() {
    this.projectsSubject.next(Array.from(this.projects.values()));
  }
}
