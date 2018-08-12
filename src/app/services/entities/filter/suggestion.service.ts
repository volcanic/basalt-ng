import {Injectable} from '@angular/core';
import {Tasklet} from '../../../model/entities/tasklet.model';
import {Subject} from 'rxjs/Subject';
import {Project} from '../../../model/entities/project.model';
import {Task} from '../../../model/entities/task.model';
import {Person} from '../../../model/entities/person.model';
import {Tag} from '../../../model/entities/tag.model';
import {PersonService} from '../person.service';
import {TagService} from '../tag.service';

@Injectable({
  providedIn: 'root'
})
export class SuggestionService {

  // Map of search items, key is creation date, value is actual value
  searchOptions: Map<string, string>;
  // Used to differentiate between search options with the same timestamp
  searchOptionsCounter = 0;

  taskOptions: Map<string, string>;
  projectOptions: Map<string, string>;
  personOptions: Map<string, string>;
  tagOptions: Map<string, string>;

  searchOptionsSubject = new Subject<string[]>();

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

  public updateByTasklets(tasklets: Tasklet[]) {

    tasklets.sort((t1, t2) => {
      return (new Date(t1.modificationDate) < new Date(t2.modificationDate)) ? 1 : -1;
    }).forEach(t => {
      if (t != null) {

        // Add persons to search options
        /*
        if (t.personIds != null && t.creationDate) {
          t.personIds.map(id => {
            return this.personService.getPersonById(id);
          }).filter(person => {
            return person != null;
          }).forEach(person => {
            const value = person.name;
            this.searchOptions.set(t.creationDate.toString() + this.searchOptionsCounter++, value);
            this.personOptions.set(value, value);
          });
        }
        */

        // Add tags to search items
        /*
        if (t.tagIds != null && t.creationDate) {
          t.tagIds.map(id => {
            return this.tagService.getTagById(id);
          }).filter(tag => {
            return tag != null;
          }).forEach(tag => {
            const value = tag.name;
            this.searchOptions.set(t.creationDate.toString() + this.searchOptionsCounter++, value);
            this.tagOptions.set(value, value);
          });
        }
        */

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

  public updateByTasks(tasks: Task[]) {

    tasks.sort((t1, t2) => {
      return (new Date(t1.modificationDate) < new Date(t2.modificationDate)) ? 1 : -1;
    }).forEach(t => {
      if (t != null) {

        // Add tags to search items
        /*
        if (t.tagIds != null && t.creationDate) {
          t.tagIds.map(id => {
            return this.tagService.getTagById(id);
          }).filter(tag => {
            return tag != null;
          }).forEach(tag => {
            const value = tag.name;
            this.searchOptions.set(t.creationDate.toString() + this.searchOptionsCounter++, value);
            this.tagOptions.set(value, value);
          });
        }
        */

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

  private notify() {
    this.searchOptions = new Map(Array.from(this.searchOptions).sort());

    // Turns search options map into an array
    const searchOptionsArrayReversed = new Set(Array.from(this.searchOptions.values()).reverse());
    // Unreverse first array (reverse is necessary to have later appearances of tags at the beginning)
    const searchOptionsArrayUnreversed = Array.from(searchOptionsArrayReversed).reverse();

    this.searchOptionsSubject.next(searchOptionsArrayUnreversed);
  }
}
