import {Injectable} from '@angular/core';
import {Tasklet} from '../model/entities/tasklet.model';
import {Subject} from 'rxjs/Subject';
import {Project} from '../model/entities/project.model';
import {Task} from '../model/entities/task.model';

@Injectable({
  providedIn: 'root'
})
export class SuggestionService {

  searchOptions: Map<string, string>;
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
      return (new Date(t1.creationDate) > new Date(t2.creationDate)) ? 1 : -1;
    }).forEach(t => {
      if (t != null) {

        // Add description lines to search items
        if (t.description.value != null) {
          t.description.value.split('\n').forEach(v => {
            if (v.trim() !== '') {
              const value = v.trim().replace(/(^-)/g, '');
              this.searchOptions.set(value, value);
            }
          });
        }

        // Add tags to search items
        if (t.tags != null) {
          t.tags.forEach(tag => {
            const value = tag.name;
            this.searchOptions.set(value, value);
            this.tagOptions.set(value, value);
          });
        }

        // Add persons to search options
        if (t.persons != null) {
          t.persons.forEach(person => {
            const value = person.name;
            this.searchOptions.set(value, value);
            this.personOptions.set(value, value);
          });
        }
      }
    });

    this.notify();
  }

  public updateByTasks(tasks: Task[]) {

    tasks.sort((t1, t2) => {
      return (new Date(t1.creationDate) > new Date(t2.creationDate)) ? 1 : -1;
    }).forEach(t => {
      if (t != null) {

        // Add description lines to search items
        if (t.description.value != null) {
          t.description.value.split('\n').forEach(v => {
            if (v.trim() !== '') {
              const value = v.trim().replace(/(^-)/g, '');
              this.searchOptions.set(value, value);
            }
          });
        }

        // Add tags to search items
        if (t.tags != null) {
          t.tags.forEach(tag => {
            const value = tag.name;
            this.searchOptions.set(value, value);
            this.tagOptions.set(value, value);
          });
        }

        // Add tasklet name to search options
        if (t.name) {
          const value = t.name.trim();
          this.searchOptions.set(value, value);
          this.taskOptions.set(value, value);
        }
      }
    });

    this.notify();
  }

  public updateByProjects(projects: Project[]) {

    projects.sort((p1, p2) => {
      return (new Date(p1.creationDate) > new Date(p2.creationDate)) ? 1 : -1;
    }).forEach(p => {
      if (p != null) {

        // Add tasklet name to search options
        if (p.name) {
          const value = p.name.trim();
          this.searchOptions.set(value, value);
          this.projectOptions.set(value, value);
        }
      }
    });

    this.notify();
  }

  private notify() {
    this.searchOptionsSubject.next(Array.from(this.searchOptions.values()));
  }
}
