import {Injectable, isDevMode} from '@angular/core';
import {Project} from '../../model/entities/project.model';
import {Subject} from 'rxjs/Subject';
import {takeUntil} from 'rxjs/internal/operators';
import {EntityType} from '../../model/entities/entity-type.enum';
import {SuggestionService} from '../suggestion.service';
import {PouchDBService} from '../pouchdb.service';
import {Tasklet} from '../../model/entities/tasklet.model';
import {Task} from '../../model/entities/task.model';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  projects = new Map<string, Project>();
  projectsSubject = new Subject<Project[]>();

  private unsubscribeSubject = new Subject();

  constructor(private pouchDBService: PouchDBService,
              private suggestionService: SuggestionService) {

    this.initializeSubscription();
    this.findProjects(50);
  }

  //
  // Initialization
  //

  private initializeSubscription() {
    this.projectsSubject.pipe(
      takeUntil(this.unsubscribeSubject)
    ).subscribe((value) => {
      (value as Project[]).forEach(project => {
          this.projects.set(project.id, project);
        }
      );

      this.suggestionService.updateByProjects(Array.from(this.projects.values()));
    });
  }

  //
  // Lookup
  //

  public findProjects(limit: number) {

    const index = {fields: ['modificationDate', 'entityType']};
    const options = {
      selector: {
        '$and': [
          {'entityType': {'$eq': EntityType.PROJECT}},
          {'modificationDate': {'$gt': null}}
        ]
      }, sort: [{'modificationDate': 'desc'}], limit: environment.LIMIT_PROJECTS
    };

    this.pouchDBService.find(index, options).then(result => {
        result['docs'].forEach(element => {
          const project = element as Project;
          this.projects.set(project.id, project);
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

  public createProject(project: Project) {
    if (project != null) {
      this.pouchDBService.put(project.id, project);
      this.projects.set(project.id, project);
      this.notify();
    }
  }

  public updateProject(project: Project) {
    if (project != null) {
      project.modificationDate = new Date();

      this.pouchDBService.put(project.id, project);
      this.projects.set(project.id, project);
      this.notify();
    }
  }

  public deleteProject(project: Project) {
    if (project != null) {
      this.pouchDBService.remove(project.id, project);
      this.projects.delete(project.id);
      this.notify();
    }
  }


  /**
   * Informs subscribers that something has changed
   */
  public notify() {
    this.projectsSubject.next(Array.from(this.projects.values()));
  }

  //
  // Lookup
  //

  public getProjectByName(name: string): Project {
    let project: Project = null;

    Array.from(this.projects.values()).forEach(p => {
      if (p.name === name) {
        project = p;
      }
    });

    return project;
  }
}
