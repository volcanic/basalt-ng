import {Injectable} from '@angular/core';
import {Tag} from '../../../model/entities/tag.model';
import {Project} from '../../../model/entities/project.model';
import {CloneService} from '../../util/clone.service';
import {takeUntil} from 'rxjs/operators';
import {ProjectService} from '../project.service';
import {Subject} from 'rxjs';
import {TaskletService} from '../tasklet.service';
import {TaskService} from '../task.service';
import {TagService} from '../tag.service';
import {Person} from '../../../model/entities/person.model';
import {PersonService} from '../person.service';

/**
 * Handles filter values
 */
@Injectable({
  providedIn: 'root'
})
export class FilterService {

  /** Current search item */
  searchItem = '';

  /** Map of tags */
  tags: Map<string, Tag> = new Map<string, Tag>();
  /** Flag indicating whether entities without tag shall be displayed */
  tagsNone = true;

  /** Map of projects */
  projects: Map<string, Project> = new Map<string, Project>();
  /** Flag indicating whether entities without project shall be displayed */
  projectsNone = true;

  /** Map of persons */
  persons: Map<string, Person> = new Map<string, Person>();
  /** Flag indicating whether entities without person shall be displayed */
  personsNone = true;

  /** Flag indicating that tags have been initialized */
  initializedTags = false;
  /** Flag indicating that projects have been initialized */
  initializedProjects = false;
  /** Flag indicating that persons have been initialized */
  initializedPersons = false;

  /** Subject publishing filter subjects */
  filterSubject = new Subject();
  /** Helper subject used to finish other subscriptions */
  unsubscribeSubject = new Subject();

  /**
   * Constructor
   * @param {ProjectService} projectService
   * @param {CloneService} cloneService
   * @param {TaskletService} taskletService
   * @param {TaskService} taskService
   * @param {TagService} tagService
   * @param {PersonService} personService
   */
  constructor(private projectService: ProjectService,
              private cloneService: CloneService,
              private taskletService: TaskletService,
              private taskService: TaskService,
              private tagService: TagService,
              private personService: PersonService) {
    this.initializeProjectSubscription();
    this.initializeTagSubscription();
    this.initializePersonSubscription();
  }

  //
  // Initialization
  //

  /**
   * Initializes project subscription
   */
  private initializeProjectSubscription() {
    this.projectService.projectsSubject.pipe(
      takeUntil(this.unsubscribeSubject)
    ).subscribe((value) => {
      if (value != null) {
        const projects = value as Project[];

        if (!this.initializedProjects) {
          this.updateProjectsList(projects, true);
          this.initializedProjects = true;
        }
      }
    });
  }

  /**
   * Initializes tag subscription
   */
  private initializeTagSubscription() {
    this.tagService.tagsSubject.pipe(
      takeUntil(this.unsubscribeSubject)
    ).subscribe((value) => {
      if (value != null) {
        const tags = value as Tag[];

        if (!this.initializedTags) {
          this.updateTagsList(tags, true);
          this.initializedTags = true;
        }
      }
    });
  }

  /**
   * Initializes person subscription
   */
  private initializePersonSubscription() {
    this.personService.personsSubject.pipe(
      takeUntil(this.unsubscribeSubject)
    ).subscribe((value) => {
      if (value != null) {
        const persons = value as Person[];

        if (!this.initializedPersons) {
          this.updatePersonsList(persons, true);
          this.initializedPersons = true;
        }
      }
    });
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
  // Tags
  //

  /**
   * Clears tags
   */
  public clearTags() {
    this.initializedTags = false;
    this.tags = new Map<string, Tag>();
  }

  /**
   * Updates tags and notifies subscribers
   * @param {Tag[]} tags list of tags
   * @param {boolean} enable enable all tags if true
   * @param {boolean} tagsNone include entities without tags if true
   */
  public updateTags(tags: Tag[], enable: boolean, tagsNone: boolean) {
    this.updateTagsListInternal(tags, enable);
    this.updateTagsNoneInternal(tagsNone);
    this.notify();
  }

  /**
   * Updates tags and notifies subscribers
   * @param {Tag[]} tags arry of tags
   * @param {boolean} enable enable tags if true
   */
  public updateTagsList(tags: Tag[], enable: boolean) {
    this.updateTagsListInternal(tags, enable);
    this.notify();
  }

  /**
   * Updates tags
   * @param {Tag[]} tags array of tags
   * @param {boolean} enable enable tags if true
   */
  private updateTagsListInternal(tags: Tag[], enable: boolean) {
    if (tags != null) {
      tags.forEach((t: Tag) => {
        const tag = CloneService.cloneTag(t);

        if (enable) {
          tag.checked = true;
        }

        this.tags.set(tag.id, tag);
      });
    }
  }

  /**
   * Updates flag which indicates that entities without tags shall be included during filtering
   * @param {boolean} tagsNone include entities without tags if true
   */
  private updateTagsNoneInternal(tagsNone: boolean) {
    this.tagsNone = tagsNone;
  }

  /**
   * Deletes tags from filter tag list that are not in use anymore
   */
  private deleteUnusedTags() {
    this.tags.forEach((outerTag, key) => { // Iterate over all existing tags
      const isContainedInTasklet = Array.from(this.taskletService.tasklets.values())
        .some(tasklet => { // Check if tag is contained in tasklets
          return tasklet.tagIds != null && tasklet.tagIds.map(id => {
            return this.tagService.getTagById(id);
          }).filter(tag => {
            return tag != null;
          }).some(innerTag => { // check if tag is contained in tasklet
            return innerTag.name === outerTag.name;
          });
        });
      const isContainedInTask = Array.from(this.taskService.tasks.values())
        .some(task => { // Check if tag is contained in tasks
          return task.tagIds != null && task.tagIds.map(id => {
            return this.tagService.getTagById(id);
          }).filter(tag => {
            return tag != null;
          }).some(innerTag => { // check if tag is contained in task
            return innerTag.name === outerTag.name;
          });
        });
      // If tag is not contained in tasklets or tasks, delete from tag list
      if (!(isContainedInTask || isContainedInTasklet)) {
        this.tags.delete(key);
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
    this.initializedProjects = false;
    this.projects = new Map<string, Project>();
  }

  /**
   * Update projects and notifies subscribers
   * @param {Project[]} projects array of projects
   * @param {boolean} enable enable projects if true
   * @param {boolean} projectsNone include entities without projects if true
   */
  public updateProjects(projects: Project[], enable: boolean, projectsNone: boolean) {
    this.updateProjectsListInternal(projects, enable);
    this.updateProjectsNoneInternal(projectsNone);
    this.notify();
  }

  /**
   * Update projects and notifies subscribers
   * @param {Project[]} projects array of projects
   * @param {boolean} enable enable projects if true
   */
  public updateProjectsList(projects: Project[], enable: boolean) {
    this.updateProjectsListInternal(projects, enable);
    this.notify();
  }

  /**
   * Update projects
   * @param {Project[]} projects array of projects
   * @param {boolean} enable enable projects if true
   */
  private updateProjectsListInternal(projects: Project[], enable: boolean) {
    projects.forEach((p: Project) => {
      if (p != null) {
        const project = CloneService.cloneProject(p);

        if (enable) {
          project.checked = true;
        }

        this.projects.set(project.id, project);
      }
    });
  }

  /**
   * Updates flag which indicates that entities without projects shall be included during filtering
   * @param {boolean} projectsNone include entities without projects if true
   */
  private updateProjectsNoneInternal(projectsNone: boolean) {
    this.projectsNone = projectsNone;
    this.notify();
  }

  //
  // Persons
  //

  /**
   * Clears persons
   */
  public clearPersons() {
    this.initializedPersons = false;
    this.persons = new Map<string, Person>();
  }

  /**
   * Updates persons and notifies subscribers
   * @param {Person[]} persons array of persons
   * @param {boolean} enable enables persons if true
   * @param {boolean} personsNone include entities without persons if true
   */
  public updatePersons(persons: Person[], enable: boolean, personsNone: boolean) {
    this.updatePersonsList(persons, enable);
    this.updatePersonsNone(personsNone);
    this.notify();
  }

  /**
   * Updates persons and notifies subscribers
   * @param {Person[]} persons array of persons
   * @param {boolean} enable enables persons if true
   */
  public updatePersonsList(persons: Person[], enable: boolean) {
    this.updatePersonsListInternal(persons, enable);
    this.notify();
  }

  /**
   * Updates persons
   * @param {Person[]} persons array of persons
   * @param {boolean} enable enables persons if true
   */
  private updatePersonsListInternal(persons: Person[], enable: boolean) {
    persons.forEach((p: Person) => {
      if (p != null) {
        const person = CloneService.clonePerson(p);

        if (enable) {
          person.checked = true;
        }

        this.persons.set(person.id, person);
      }
    });
  }

  /**
   * Updates flag which indicates that entities without persons shall be included during filtering
   * @param {boolean} personsNone include entities without persons if true
   */
  private updatePersonsNone(personsNone: boolean) {
    this.personsNone = personsNone;
    this.notify();
  }

  /**
   * Clears all currently set filters
   */
  public clearAllFilters() {
    this.clearTagFilter();
    this.clearPersonFilter();
    this.notify();
  }

  /**
   * Clears all tag-related filters
   */
  private clearTagFilter() {
    this.tags.forEach((value) => {
      const currentTag = value as Tag;
      currentTag.checked = true;
    });
    this.tagsNone = true;
  }

  /**
   * Clears all person-related filters
   */
  private clearPersonFilter() {
    this.persons.forEach((value) => {
      const currentPerson = value as Person;
      currentPerson.checked = true;
    });
    this.personsNone = true;
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
