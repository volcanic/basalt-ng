import {Injectable} from '@angular/core';
import {Tasklet} from '../../../model/entities/tasklet.model';
import {Subject} from 'rxjs/Subject';
import {Project} from '../../../model/entities/project.model';
import {Task} from '../../../model/entities/task.model';
import {Person} from '../../../model/entities/person.model';
import {Tag} from '../../../model/entities/tag.model';

/**
 * Service handling suggestions
 */
@Injectable({
  providedIn: 'root'
})
export class SuggestionService {

  /** Map of search items, key is creation date, inputFieldValue is actual inputFieldValue */
  searchOptions: Map<string, string>;
  /** Counter used to differentiate between search options with the same timestamp */
  searchOptionsCounter = 0;

  /** Map of task options */
  taskOptions: Map<string, string>;
  /** Map of project options */
  projectOptions: Map<string, string>;
  /** Map of person options */
  personOptions: Map<string, string>;
  /** Map of tag options */
  tagOptions: Map<string, string>;

  /** Subject that publishes search options */
  searchOptionsSubject = new Subject<string[]>();

  /**
   * Constructor
   */
  constructor() {
    this.searchOptions = new Map<string, string>();
    this.taskOptions = new Map<string, string>();
    this.projectOptions = new Map<string, string>();
    this.personOptions = new Map<string, string>();
    this.tagOptions = new Map<string, string>();
  }

  //
  // Updates
  //

  /**
   * Adds tasklets information to suggestions
   * @param {Tasklet[]} tasklets new array of tasklets
   */
  public updateByTasklets(tasklets: Tasklet[]) {
    tasklets.sort((t1, t2) => {
      return (new Date(t1.modificationDate) < new Date(t2.modificationDate)) ? 1 : -1;
    }).forEach(t => {
      if (t != null) {
        // Add description lines to search items
        if (t.description.value != null && t.creationDate) {
          t.description.value.split('\n').forEach(v => {
            if (v.trim() !== '') {
              const value = v.trim().replace(/(^-)/g, '');
              this.searchOptions.set(t.creationDate.toString() + this.searchOptionsCounter++, value);
            }
          });
        }
      }
    });

    this.notify();
  }

  /**
   * Adds tasks information to suggestions
   * @param {Task[]} tasks new array of tasks
   */
  public updateByTasks(tasks: Task[]) {
    tasks.sort((t1, t2) => {
      return (new Date(t1.modificationDate) < new Date(t2.modificationDate)) ? 1 : -1;
    }).forEach(t => {
      if (t != null) {
        // Add description lines to search items
        if (t.description.value != null && t.creationDate) {
          t.description.value.split('\n').forEach(v => {
            if (v.trim() !== '') {
              const value = v.trim().replace(/(^-)/g, '');
              this.searchOptions.set(t.creationDate.toString() + this.searchOptionsCounter++, value);
            }
          });
        }

        // Add task name to search options
        if (t.name && t.creationDate) {
          const value = t.name.trim();
          this.searchOptions.set(t.creationDate.toString() + this.searchOptionsCounter++, value);
          this.taskOptions.set(value, value);
        }
      }
    });

    this.notify();
  }

  /**
   * Adds projects information to suggestions
   * @param {Project[]} projects new array of projects
   */
  public updateByProjects(projects: Project[]) {
    projects.sort((p1, p2) => {
      return (new Date(p1.modificationDate) < new Date(p2.modificationDate)) ? 1 : -1;
    }).forEach(p => {
      if (p != null) {
        // Add project name to search options
        if (p.name && p.creationDate) {
          const value = p.name.trim();
          this.searchOptions.set(p.creationDate.toString() + this.searchOptionsCounter++, value);
          this.projectOptions.set(value, value);
        }
      }
    });

    this.notify();
  }

  /**
   * Adds persons information to suggestions
   * @param {Person[]} persons new array of persons
   */
  public updateByPersons(persons: Person[]) {
    persons.forEach(p => {
      if (p != null) {
        // Add person name to search options
        if (p.name) {
          const value = p.name.trim();
          this.searchOptions.set(value, value);
          this.personOptions.set(value, value);
        }
      }
    });

    this.notify();
  }

  /**
   * Add tags information to suggestions
   * @param {Tag[]} tags new array of tags
   */
  public updateByTags(tags: Tag[]) {
    tags.forEach(t => {
      if (t != null) {
        // Add person name to search options
        if (t.name) {
          const value = t.name.trim();
          this.searchOptions.set(value, value);
          this.tagOptions.set(value, value);
        }
      }
    });

    this.notify();
  }

  //
  // Notification
  //

  /**
   * Notifies subscribers that something has changed
   */
  private notify() {
    this.searchOptions = new Map(Array.from(this.searchOptions).sort());

    // Turns search options map into an array
    const searchOptionsArrayReversed = new Set(Array.from(this.searchOptions.values()).reverse());
    // Unreverse first array (reverse is necessary to have later appearances of tags at the beginning)
    const searchOptionsArrayUnreversed = Array.from(searchOptionsArrayReversed).reverse();

    this.searchOptionsSubject.next(searchOptionsArrayUnreversed);
  }
}
