import {Injectable} from '@angular/core';
import {CloneService} from './clone.service';
import {ProjectService} from './project/project.service';
import {Subject} from 'rxjs';
import {TaskletService} from './tasklet/tasklet.service';
import {TaskService} from './task/task.service';
import {TagService} from './tag/tag.service';
import {Person} from '../model/person.model';
import {PersonService} from './person/person.service';
import {Project} from '../model/project.model';
import {Tag} from '../model/tag.model';
import {Task} from '../model/task.model';

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
   * @param cloneService clone service
   * @param taskletService tasklet service
   * @param taskService task service
   * @param projectService project service
   * @param tagService tag service
   * @param personService person service
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
   * @param searchItem new search item
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
   * @param tasks array of tasks
   */
  public updateTasksList(tasks: Task[]) {
    this.updateTasksListInternal(tasks);
    this.notify();
  }

  /**
   * Updates tasks and notifies subscribers
   * @param tasks arry of tasks
   */
  public updateTasksListIfNotEmpty(tasks: Task[]) {
    if (this.tasks.size > 0) {
      this.updateTasksList(tasks);
    }
  }

  /**
   * Update tasks
   * @param tasks array of tasks
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
   * @param projects array of projects
   */
  public updateProjectsList(projects: Project[]) {
    this.updateProjectsListInternal(projects);
    this.notify();
  }

  /**
   * Updates projects and notifies subscribers
   * @param projects arry of projects
   */
  public updateProjectsListIfNotEmpty(projects: Project[]) {
    if (this.projects.size > 0) {
      this.updateProjectsList(projects);
    }
  }

  /**
   * Update projects
   * @param projects array of projects
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
   * @param tags arry of tags
   */
  public updateTagsList(tags: Tag[]) {
    this.updateTagsListInternal(tags);
    this.notify();
  }

  /**
   * Updates tags and notifies subscribers
   * @param tags array of tags
   */
  public updateTagsListIfNotEmpty(tags: Tag[]) {
    if (this.tags.size > 0) {
      this.updateTagsList(tags);
    }
  }

  /**
   * Updates tags
   * @param tags array of tags
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
   * @param persons array of persons
   */
  public updatePersonsList(persons: Person[]) {
    this.updatePersonsListInternal(persons);
    this.notify();
  }

  /**
   * Updates persons and notifies subscribers
   * @param persons array of persons
   */
  public updatePersonsListIfNotEmpty(persons: Person[]) {
    if (this.persons.size > 0) {
      this.updatePersonsList(persons);
    }
  }

  /**
   * Updates persons
   * @param persons array of persons
   */
  private updatePersonsListInternal(persons: Person[]) {
    persons.forEach((p: Person) => {
      if (p != null) {
        const person = CloneService.clonePerson(p);

        this.persons.set(person.id, person);
      }
    });
  }

  //
  // Clear
  //

  /**
   * Clears all currently set filters
   */
  public clearAllFilters() {
    this.clearSearchItem();
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
