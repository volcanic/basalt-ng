import {Injectable} from '@angular/core';
import {Tasklet} from '../model/tasklet.model';
import {Subject} from 'rxjs';
import {Project} from '../model/project.model';
import {Task} from '../model/task.model';
import {Person} from '../model/person.model';
import {Tag} from '../model/tag.model';

/**
 * Service handling suggestions
 */
@Injectable({
  providedIn: 'root'
})
export class SuggestionService {

  /** Map of search items, key is creation date, value is actual value */
  searchOptions: Map<string, string>;
  /** Counter used to differentiate between search options with the same timestamp */
  searchOptionsCounter = 0;

  /** Map of task options */
  taskOptions: Map<string, Task>;
  /** Map of project options */
  projectOptions: Map<string, Project>;
  /** Map of person options */
  personOptions: Map<string, Person>;
  /** Map of tag options */
  tagOptions: Map<string, Tag>;

  /** Subject that publishes search options */
  searchOptionsSubject = new Subject<string[]>();

  /**
   * Constructor
   */
  constructor() {
    this.searchOptions = new Map<string, string>();
    this.taskOptions = new Map<string, Task>();
    this.projectOptions = new Map<string, Project>();
    this.personOptions = new Map<string, Person>();
    this.tagOptions = new Map<string, Tag>();
  }

  //
  // Updates
  //

  /**
   * Adds tasklets information to suggestions
   * @param taskletMap tasklets map
   */
  public updateByTasklets(taskletMap: Map<string, Tasklet>) {
    Array.from(taskletMap.values()).sort((t1, t2) => {
      return (new Date(t1.modificationDate) < new Date(t2.modificationDate)) ? 1 : -1;
    }).forEach(t => {
      if (t != null && t.description != null) {
        // Add description lines to search items
        if (t.description.value != null && t.creationDate) {
          t.description.value.split('\n').forEach(v => {
            if (v.trim() !== '') {
              const value = v.trim().replace(/(^-)/g, '');
              this.searchOptions.set(t.creationDate.toString() + this.searchOptionsCounter++, value);
            }
          });
        }

        // Add meeting minutes to search item
        if (t.meetingMinuteItems != null && t.creationDate) {
          t.meetingMinuteItems.forEach(m => {
            const value = m.statement.trim().replace(/(^-)/g, '');
            this.searchOptions.set(t.creationDate.toString() + this.searchOptionsCounter++, value);
          });
        }

        // Add daily scrum items to search item
        if (t.dailyScrumItems != null && t.creationDate) {
          t.dailyScrumItems.forEach(d => {
            const value = d.statement.trim().replace(/(^-)/g, '');
            this.searchOptions.set(t.creationDate.toString() + this.searchOptionsCounter++, value);
          });
        }
      }
    });

    this.notify();
  }

  /**
   * Adds tasks information to suggestions
   * @param tasks new array of tasks
   */
  public updateByTasks(tasks: Task[]) {
    this.taskOptions.clear();

    tasks.sort((t1, t2) => {
      return (new Date(t1.modificationDate) < new Date(t2.modificationDate)) ? 1 : -1;
    }).forEach(t => {
      if (t != null && t.description != null) {
        // Add description lines to search items
        if (t.description.value != null && t.creationDate && !t.proxy) {
          t.description.value.split('\n').forEach(v => {
            if (v.trim() !== '') {
              const value = v.trim().replace(/(^-)/g, '');
              this.searchOptions.set(t.creationDate.toString() + this.searchOptionsCounter++, value);
            }
          });
        }

        // Add task name to search options
        if (t.name && t.creationDate && !t.proxy) {
          const value = t.name.trim();
          this.searchOptions.set(t.creationDate.toString() + this.searchOptionsCounter++, value);
          this.taskOptions.set(value, t);
        }
      }
    });

    this.notify();
  }

  /**
   * Adds projects information to suggestions
   * @param projects new array of projects
   */
  public updateByProjects(projects: Project[]) {
    this.projectOptions.clear();

    projects.sort((p1, p2) => {
      return (new Date(p1.modificationDate) < new Date(p2.modificationDate)) ? 1 : -1;
    }).forEach(p => {
      if (p != null) {
        // Add project name to search options
        if (p.name && p.creationDate) {
          const value = p.name.trim();
          this.searchOptions.set(p.creationDate.toString() + this.searchOptionsCounter++, value);
          this.projectOptions.set(value, p);
        }
      }
    });

    this.notify();
  }

  /**
   * Adds persons information to suggestions
   * @param persons new array of persons
   */
  public updateByPersons(persons: Person[]) {
    this.personOptions.clear();

    persons.forEach(p => {
      if (p != null) {
        // Add person name to search options
        if (p.name) {
          const value = p.name.trim();
          this.searchOptions.set(value, value);
          this.personOptions.set(value, p);
        }
      }
    });

    this.notify();
  }

  /**
   * Add tags information to suggestions
   * @param tags new array of tags
   */
  public updateByTags(tags: Tag[]) {
    this.tagOptions.clear();

    tags.forEach(t => {
      if (t != null) {
        // Add person name to search options
        if (t.name) {
          const value = t.name.trim();
          this.searchOptions.set(value, value);
          this.tagOptions.set(value, t);
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
