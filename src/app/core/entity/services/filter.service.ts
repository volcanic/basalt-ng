import {Injectable} from '@angular/core';
import {Tag} from '../model/tag.model';
import {Task} from '../model/task.model';
import {Project} from '../model/project.model';
import {CloneService} from './clone.service';
import {ProjectService} from './project.service';
import {Subject} from 'rxjs';
import {TaskletService} from './tasklet/tasklet.service';
import {TaskService} from './task/task.service';
import {TagService} from './tag.service';
import {Person} from '../model/person.model';
import {PersonService} from './person.service';

/**
 * Handles filter values
 */
@Injectable({
  providedIn: 'root'
})
export class FilterService {

  /** Current search item */
  searchItem;

  /** Map of tasks */
  tasks: Map<string, Task>;

  /** Map of projects */
  projects: Map<string, Project>;

  /** Map of tags */
  tags: Map<string, Tag>;

  /** Map of persons */
  persons: Map<string, Person>;

  /** Subject publishing filter subjects */
  filterSubject = new Subject();
  /** Helper subject used to finish other subscriptions */
  unsubscribeSubject = new Subject();

  /**
   * Constructor
   * @param {CloneService} cloneService
   * @param {TaskletService} taskletService
   * @param {TaskService} taskService
   * @param {ProjectService} projectService
   * @param {TagService} tagService
   * @param {PersonService} personService
   */
  constructor(private cloneService: CloneService,
              private taskletService: TaskletService,
              private taskService: TaskService,
              private projectService: ProjectService,
              private tagService: TagService,
              private personService: PersonService) {
    this.clearAllFilters();
  }

  //
  // Search item
  //

  /**
   * Clears the search item and notifies subscribers
   */
  public clearSearchItem() {
    this.searchItem = '';
    this.notify();
  }

  /**
   * Updates search item and notifies subscribers
   * @param {string} searchItem new search item
   */
  public updateSearchItem(searchItem: string) {
    this.searchItem = searchItem;
    this.notify();
  }

  //
  // Tasks
  //

  /**
   * Clears tasks
   */
  public clearTasks() {
    this.tasks = new Map<string, Task>();
  }

  /**
   * Update tasks and notifies subscribers
   * @param {Task[]} tasks array of tasks
   */
  public updateTasksList(tasks: Task[]) {
    this.updateTasksListInternal(tasks);
    this.notify();
  }

  /**
   * Updates tasks and notifies subscribers
   * @param {Task[]} tasks arry of tasks
   */
  public updateTasksListIfNotEmpty(tasks: Task[]) {
    if (this.tasks.size > 0) {
      this.updateTasksList(tasks);
    }
  }

  /**
   * Update tasks
   * @param {Task[]} tasks array of tasks
   */
  private updateTasksListInternal(tasks: Task[]) {
    tasks.forEach((t: Task) => {
      if (t != null) {
        const task = CloneService.cloneTask(t);

        this.tasks.set(task.id, task);
      }
    });
  }

  //
  // Projects
  //

  /**
   * Clears projects
   */
  public clearProjects() {
    this.projects = new Map<string, Project>();
  }

  /**
   * Update projects and notifies subscribers
   * @param {Project[]} projects array of projects
   */
  public updateProjectsList(projects: Project[]) {
    this.updateProjectsListInternal(projects);
    this.notify();
  }

  /**
   * Updates projects and notifies subscribers
   * @param {Project[]} projects arry of projects
   */
  public updateProjectsListIfNotEmpty(projects: Project[]) {
    if (this.projects.size > 0) {
      this.updateProjectsList(projects);
    }
  }

  /**
   * Update projects
   * @param {Project[]} projects array of projects
   */
  private updateProjectsListInternal(projects: Project[]) {
    projects.forEach((p: Project) => {
      if (p != null) {
        const project = CloneService.cloneProject(p);

        this.projects.set(project.id, project);
      }
    });
  }

  //
  // Tags
  //

  /**
   * Clears tags
   */
  public clearTags() {
    this.tags = new Map<string, Tag>();
  }

  /**
   * Updates tags and notifies subscribers
   * @param {Tag[]} tags arry of tags
   */
  public updateTagsList(tags: Tag[]) {
    this.updateTagsListInternal(tags);
    this.notify();
  }

  /**
   * Updates tags and notifies subscribers
   * @param {Tag[]} tags array of tags
   */
  public updateTagsListIfNotEmpty(tags: Tag[]) {
    if (this.tags.size > 0) {
      this.updateTagsList(tags);
    }
  }

  /**
   * Updates tags
   * @param {Tag[]} tags array of tags
   */
  private updateTagsListInternal(tags: Tag[]) {
    if (tags != null) {
      tags.forEach((t: Tag) => {
        const tag = CloneService.cloneTag(t);

        this.tags.set(tag.id, tag);
      });
    }
  }

  //
  // Persons
  //

  /**
   * Clears persons
   */
  public clearPersons() {
    this.persons = new Map<string, Person>();
  }

  /**
   * Updates persons and notifies subscribers
   * @param {Person[]} persons array of persons
   */
  public updatePersonsList(persons: Person[]) {
    this.updatePersonsListInternal(persons);
    this.notify();
  }

  /**
   * Updates persons and notifies subscribers
   * @param {Person[]} persons array of persons
   */
  public updatePersonsListIfNotEmpty(persons: Person[]) {
    if (this.persons.size > 0) {
      this.updatePersonsList(persons);
    }
  }

  /**
   * Updates persons
   * @param {Person[]} persons array of persons
   */
  private updatePersonsListInternal(persons: Person[]) {
    persons.forEach((p: Person) => {
      if (p != null) {
        const person = CloneService.clonePerson(p);

        this.persons.set(person.id, person);
      }
    });
  }

  /**
   * Clears all currently set filters
   */
  public clearAllFilters() {
    this.clearTasks();
    this.clearProjects();
    this.clearTags();
    this.clearPersons();
    this.notify();
  }

  //
  // Notification
  //

  /**
   * Notifies subscribers that something has changed
   */
  private notify() {
    this.filterSubject.next();
  }
}
