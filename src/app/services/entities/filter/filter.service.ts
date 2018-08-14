import {Injectable} from '@angular/core';
import {Tag} from '../../../model/entities/tag.model';
import {Project} from '../../../model/entities/project.model';
import {CloneService} from '../../util/clone.service';
import {takeUntil} from 'rxjs/operators';
import {ProjectService} from '../project.service';
import {Subject} from 'rxjs';
import {TaskletService} from '../tasklet.service';
import {TaskService} from '../task.service';
import {Tasklet} from '../../../model/entities/tasklet.model';
import {Task} from '../../../model/entities/task.model';
import {TagService} from '../tag.service';
import {Person} from '../../../model/entities/person.model';
import {PersonService} from '../person.service';

@Injectable({
  providedIn: 'root'
})

export class FilterService {

  searchItem = '';

  tags: Map<string, Tag> = new Map<string, Tag>();
  tagsNone = true;

  projects: Map<string, Project> = new Map<string, Project>();
  projectsNone = true;

  persons: Map<string, Person> = new Map<string, Person>();
  personsNone = true;

  initializedTagsOfTasklets = false;
  initializedTagsOfTasks = false;
  initializedTags = false;
  initializedProjects = false;

  initializedPersons = false;

  filterSubject = new Subject();
  unsubscribeSubject = new Subject();

  constructor(private projectService: ProjectService,
              private cloneService: CloneService,
              private taskletService: TaskletService,
              private taskService: TaskService,
              private tagService: TagService,
              private personService: PersonService) {

    // Subscribe tasklet changes
    this.taskletService.taskletsSubject.pipe(
      takeUntil(this.unsubscribeSubject)
    ).subscribe((value) => {
      if (value != null) {
        const tasklets = value as Tasklet[];

        // Initialize tags
        if (!this.initializedTagsOfTasklets) {
          this.updateTagsOfTasklets(tasklets, true);
        }
        this.deleteUnusedTags();
        this.initializedTagsOfTasklets = true;
      }
    });

    // Subscribe task changes
    this.taskService.tasksSubject.pipe(
      takeUntil(this.unsubscribeSubject)
    ).subscribe((value) => {
      if (value != null) {
        const tasks = value as Task[];

        if (!this.initializedTagsOfTasks) {
          this.updateTagsOfTasks(tasks, true);
        }
        this.deleteUnusedTags();
        this.initializedTagsOfTasks = true;
      }
    });

    // Subscribe tag changes
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

    // Subscribe project changes
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

    // Subscribe person changes
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

  public clearSearchItem() {
    this.searchItem = '';
  }

  public updateSearchItem(searchItem: string) {
    this.searchItem = searchItem;
    this.notify();
  }

  //
  // Tags
  //

  public clearTags() {
    this.initializedTags = false;
    this.initializedTagsOfTasklets = false;
    this.initializedTagsOfTasks = false;
    this.tags = new Map<string, Tag>();
  }

  private updateTagsOfTasklets(tasklets: Tasklet[], enable: boolean) {
    tasklets.forEach(tasklet => {
      this.updateTagsList(tasklet.tagIds.map(id => {
        return this.tagService.getTagById(id);
      }).filter(tag => {
        return tag != null;
      }), enable);
    });
    this.notify();
  }

  private updateTagsOfTasks(tasks: Task[], enable: boolean) {
    tasks.forEach(task => {
      if (task.tagIds != null) {
        this.updateTagsList(task.tagIds.map(id => {
          return this.tagService.getTagById(id);
        }).filter(tag => {
          return tag != null;
        }), enable);
      }
    });
    this.notify();
  }

  public updateTags(tags: Tag[], enable: boolean, tagsNone: boolean) {
    this.updateTagsList(tags, enable);
    this.updateTagsNone(tagsNone);
    this.notify();
  }

  public updateTagsList(tags: Tag[], enable: boolean) {
    this.updateTagsListInternal(tags, enable);
    this.notify();
  }

  private updateTagsListInternal(tags: Tag[], enable: boolean) {

    if (tags != null) {
      tags.forEach((t: Tag) => {
        // Deep copy
        const tag = this.cloneService.cloneTag(t);

        if (enable) {
          tag.checked = true;
        }

        this.tags.set(tag.id, tag);
      });
    }
  }

  public updateTagsNone(tagsNone: boolean) {
    this.tagsNone = tagsNone;
  }

  /**
   * Deletes tags from filter tag list that are not in use anymore
   */
  private deleteUnusedTags() {
    this.tags.forEach((outerTag, key) => { // Iterate over all existing tags
      const isContainedInTasklet = Array.from(this.taskletService.tasklets.values())
        .some(tasklet => { // Check if tag is contained in tasklets
          return tasklet.tagIds.map(id => {
            return this.tagService.getTagById(id);
          }).filter(tag => {
            return tag != null;
          }).some(innerTag => { // check if tag is contained in tasklet
            return innerTag.name === outerTag.name;
          });
        });
      const isContainedInTask = Array.from(this.taskService.tasks.values())
        .some(task => { // Check if tag is contained in tasks
          return task.tagIds.map(id => {
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

  public clearProjects() {
    this.initializedProjects = false;
    this.projects = new Map<string, Project>();
  }

  public updateProjects(projects: Project[], enable: boolean, projectsNone: boolean) {
    this.updateProjectsList(projects, enable);
    this.updateProjectsNone(projectsNone);
    this.notify();
  }

  public updateProjectsList(projects: Project[], enable: boolean) {
    this.updateProjectsListInternal(projects, enable);
    this.notify();
  }

  private updateProjectsListInternal(projects: Project[], enable: boolean) {
    projects.forEach((p: Project) => {
      if (p != null) {
        // Deep copy
        const project = this.cloneService.cloneProject(p);

        if (enable) {
          project.checked = true;
        }

        this.projects.set(project.id, project);
      }
    });
  }

  private updateProjectsNone(projectsNone: boolean) {
    this.projectsNone = projectsNone;
    this.notify();
  }

  //
  // Persons
  //

  public clearPersons() {
    this.initializedPersons = false;
    this.persons = new Map<string, Person>();
  }

  public updatePersons(persons: Person[], enable: boolean, personsNone: boolean) {
    this.updatePersonsList(persons, enable);
    this.updatePersonsNone(personsNone);
    this.notify();
  }

  public updatePersonsList(persons: Person[], enable: boolean) {
    this.updatePersonsListInternal(persons, enable);
    this.notify();
  }

  private updatePersonsListInternal(persons: Person[], enable: boolean) {
    persons.forEach((p: Person) => {
      if (p != null) {
        // Deep copy
        const person = this.cloneService.clonePerson(p);

        if (enable) {
          person.checked = true;
        }

        this.persons.set(person.id, person);
      }
    });
  }

  public updatePersonsNone(personsNone: boolean) {
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
    this.tags.forEach((value) => { // Iterate through tags
      const currentTag = value as Tag;
      currentTag.checked = true; // Activate each tag
    });
    this.tagsNone = true; // Select "elements without tags" tag
  }

  /**
   * Clears all person-related filters
   */
  private clearPersonFilter() {
    this.persons.forEach((value) => { // Iterate through persons
      const currentPerson = value as Person;
      currentPerson.checked = true; // Activate each person
    });
    this.personsNone = true; // Select "elements without persons" checkbox
  }

  //
  // Notifications
  //

  public notify() {
    this.filterSubject.next();
  }
}
