import {Injectable, isDevMode} from '@angular/core';
import {Project} from '../../model/project.model';
import {Subject} from 'rxjs';
import {EntityType} from '../../model/entity-type.enum';
import {SuggestionService} from '../suggestion.service';
import {PouchDBService} from '../../../persistence/services/pouchdb.service';
import {environment} from '../../../../../environments/environment';
import {SnackbarService} from '../../../ui/services/snackbar.service';
import {ScopeService} from '../scope.service';
import {Scope} from '../../model/scope.enum';
import {DateService} from '../date.service';

/**
 * Handles projects including
 * <li> Queries
 * <li> Persistence
 * <li> Lookup
 * <li> Sort
 */
@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  /** Map of all projects */
  projects = new Map<string, Project>();
  /** Subject that can be subscribed by components that are interested in changes */
  projectsSubject = new Subject<Map<string, Project>>();

  //
  // Sort
  //

  /**
   * Sorts projects by name
   * @param p1 project
   * @param p2 project
   */
  static sortProjectsByName(p1: Project, p2: Project) {
    return p2.name < p1.name ? 1 : -1;
  }

  /**
   * Sorts projects by modification date
   * @param p1 project
   * @param p2 project
   */
  static sortProjectsByModificationDate(p1: Project, p2: Project) {
    return new Date(p2.modificationDate).getTime() - new Date(p1.modificationDate).getTime();
  }

  /**
   * Constructor
   * @param pouchDBService pouchDB service
   * @param suggestionService suggestion service
   * @param snackbarService snackbar service
   * @param scopeService scope service
   */
  constructor(private pouchDBService: PouchDBService,
              private suggestionService: SuggestionService,
              private snackbarService: SnackbarService,
              private scopeService: ScopeService) {
    this.initializeProjectSubscription();
    this.findProjectsByScope(this.scopeService.scope);
  }

  //
  // Initialization
  //

  /**
   * Initializes project subscription
   */
  private initializeProjectSubscription() {
    this.projectsSubject.subscribe((value) => {
      Array.from(value.values()).forEach(project => {
          this.projects.set(project.id, project);
        }
      );

      this.suggestionService.updateByProjects(Array.from(this.projects.values()));
    });
  }

  //
  // Queries
  //

  /**
   * Loads projects by a given scope
   * @param scope scope to filter by
   */
  public findProjectsByScope(scope: Scope) {
    const startDate = DateService.addDays(new Date(), -(environment.LIMIT_PROJECTS_DAYS));

    const index = {fields: ['entityType', 'scope', 'modificationDate']};
    const options = {
      selector: {
        $and: [
          {entityType: {$eq: EntityType.PROJECT}},
          {scope: {$eq: scope}},
          {modificationDate: {$gt: startDate.toISOString()}}
        ]
      },
      // sort: [{'modificationDate': 'desc'}],
      limit: environment.LIMIT_PROJECTS_COUNT
    };

    this.clearProjects();
    this.findProjectsInternal(index, options);
  }

  /**
   * Clears projects
   */
  private clearProjects() {
    this.projects.clear();
  }

  /**
   * Index projects and queries them afterwards
   * @param index index to be used
   * @param options query options
   */
  private findProjectsInternal(index: any, options: any) {
    this.pouchDBService.find(index, options).then(result => {
        if (result != null) {
          result['docs'].forEach(element => {
            const project = element as Project;
            this.projects.set(project.id, project);
          });

          this.notify();
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
   * Creates a new project
   * @param project project to be created
   * @param showSnack shows snackbar if true
   */
  public createProject(project: Project, showSnack: boolean = false): Promise<any> {
    return new Promise(() => {
      if (project != null) {
        project.scope = this.scopeService.scope;

        return this.pouchDBService.put(project.id, project).then(() => {
          if (showSnack) {
            this.snackbarService.showSnackbar('Created project');
          }
          this.projects.set(project.id, project);
          this.notify();
        });
      }
    });
  }

  /**
   * Updates an existing project
   * @param project project to be updated
   * @param showSnack shows snackbar if true
   */
  public updateProject(project: Project, showSnack: boolean = false): Promise<any> {
    return new Promise(() => {
      if (project != null) {
        project.modificationDate = new Date();

        return this.pouchDBService.upsert(project.id, project).then(() => {
          if (showSnack) {
            this.snackbarService.showSnackbar('Updated project');
          }
          this.projects.set(project.id, project);
          this.notify();
        });
      }
    });
  }

  /**
   * Deletes a project
   * @param project project to be deleted
   */
  public deleteProject(project: Project): Promise<any> {
    return new Promise(() => {
      if (project != null) {
        this.pouchDBService.remove(project.id, project).then(() => {
          this.snackbarService.showSnackbar('Deleted project');
          this.projects.delete(project.id);
          this.notify();
        }).catch((error) => {
          if (isDevMode()) {
            console.error(error);
          }
          this.snackbarService.showSnackbarWithAction('An error occurred during deletion', 'RETRY', () => {
            this.deleteProject(project).then(() => {
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
   * Retrieves a project by a given name
   * @param name name to find project by
   * @returns project identified by given name, null if no such project exists
   */
  public getProjectByName(name: string): Project {
    let project: Project = null;

    Array.from(this.projects.values()).forEach(p => {
      if (p.name === name) {
        project = p;
      }
    });

    return project;
  }

  //
  // Notification
  //

  /**
   * Informs subscribers that something has changed
   */
  private notify() {
    this.projectsSubject.next(this.projects);
  }
}
