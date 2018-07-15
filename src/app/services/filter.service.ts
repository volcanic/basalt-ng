import {Injectable} from '@angular/core';
import {Tag} from '../model/tag.model';
import {Project} from '../model/entities/project.model';
import {PlaceholderValues} from '../model/placeholder-values.model';
import {CloneService} from './util/clone.service';
import {takeUntil} from 'rxjs/operators';
import {ProjectService} from './entities/project.service';
import {Subject} from 'rxjs/index';
import {TaskletService} from './entities/tasklet.service';
import {TaskService} from './entities/task.service';
import {Task} from '../model/entities/task.model';

@Injectable({
  providedIn: 'root'
})

export class FilterService {

  searchItem = '';
  tags: Map<string, Tag> = new Map<string, Tag>();
  projects: Map<string, Project> = new Map<string, Project>();
  filterSubject = new Subject();


  private projectUnsubscribeSubject = new Subject();

  constructor(private projectService: ProjectService,
              private cloneService: CloneService,
              private taskletService: TaskletService,
              private taskService: TaskService
  ) {
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

  public initializeTags() {
    if (this.tags.size < 2) {
      // Add empty element
      const tag = new Tag(PlaceholderValues.EMPTY_TAG, true);
      this.tags.set(tag.name, tag);

      // Add all the other tags
      this.updateTags(Array.from(this.taskletService.tags.values()), true);
      this.updateTags(Array.from(this.taskService.tags.values()), true);
      this.notify();
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

  /**
   * Deletes tags from filter tag list that are not in use anymore
   */
  public deleteUnusedTags() {
    this.tags.forEach((outerTag, key) => { // Iterate over all existing tags
      if (outerTag.name !== 'empty') { // Ignore the "empty" tag
        const isContainedInTasklet = Array.from(this.taskletService.tasklets.values()).some(tasklet => { // Check if tag is contained in tasklets
          return tasklet.tags.some(innerTag => { // check if tag is contained in tasklet
            return innerTag.name === outerTag.name;
          });
        });
        const isContainedInTask = Array.from(this.taskService.tasks.values()).some(task => { // Check if tag is contained in tasks
          return task.tags.some(innerTag => { // check if tag is contained in task
            return innerTag.name === outerTag.name;
          });
        });
        if (!(isContainedInTask || isContainedInTasklet)) { // If tag is not contained in tasklets or tasks, delete from tag list
          this.tags.delete(key);
        }
      }
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

  public notify() {
    this.filterSubject.next();
  }
}
