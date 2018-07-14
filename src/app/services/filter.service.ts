import {Injectable} from '@angular/core';
import {Tag} from '../model/tag.model';
import {Project} from '../model/entities/project.model';
import {PlaceholderValues} from '../model/placeholder-values.model';
import {CloneService} from './util/clone.service';
import {takeUntil} from 'rxjs/operators';
import {ProjectService} from './entities/project.service';
import {Subject} from 'rxjs/index';

@Injectable({
  providedIn: 'root'
})
export class FilterService {

  searchItem = '';
  tags: Map<string, Tag> = new Map<string, Tag>();
  projects: Map<string, Project> = new Map<string, Project>();

  private projectUnsubscribeSubject = new Subject();

  constructor(private projectService: ProjectService,
              private cloneService: CloneService) {

    // Subscribe project changes
    this.projectService.projectsSubject.pipe(
      takeUntil(this.projectUnsubscribeSubject)
    ).subscribe((value) => {
      if (value != null) {
        (value as Project[]).forEach(p => {
          if (!this.projects.has(p.id)) {
            this.projects.set(p.id, p);
          }
        });
      }
    });
  }

  public initializeTags(tags: Tag[]) {
    if (this.tags.size < 2) {
      // Add empty element
      const tag = new Tag(PlaceholderValues.EMPTY_TAG, true);
      this.tags.set(tag.name, tag);

      // Add all the other tags
      this.updateTags(tags, true);
    }
  }

  public updateTags(tags: Tag[], enable: boolean) {
    tags.forEach((t: Tag) => {
      // Deep copy
      const tag = this.cloneService.cloneTag(t);

      if (enable) {
        tag.checked = true;
      }

      this.tags.set(tag.name, tag);
    });
  }

  public initializeProjects(projects: Project[]) {
    if (this.projects.size < 2) {

      // Add empty element
      const project = new Project(PlaceholderValues.EMPTY_PROJECT, true);
      project.id = PlaceholderValues.EMPTY_PROJECT_ID;
      this.projects.set(project.id, project);

      projects.forEach((p: Project) => {
        // Deep copy
        const filterProject = this.cloneService.cloneProject(p);
        filterProject.checked = true;
        this.projects.set(filterProject.id, filterProject);
      });
    }
  }

  public updateProjects(projects: Project[], enable: boolean) {
    projects.forEach((p: Project) => {
      // Deep copy
      const project = this.cloneService.cloneProject(p);

      if (enable) {
        project.checked = true;
      }

      this.projects.set(project.id, project);
    });
  }
}
