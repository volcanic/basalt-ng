import {Injectable, isDevMode} from '@angular/core';
import {Tasklet} from '../model/tasklet.model';
import {Subject} from 'rxjs/Subject';
import {PouchDBService} from './pouchdb.service';
import {Tag} from '../model/tag.model';

@Injectable()
export class TaskletsService {
  tasklets = new Map<String, Tasklet>();
  taskletsSubject = new Subject<Tasklet[]>();
  filteredTasklets = [];

  tags: Tag[] = [];

  constructor(private pouchDBService: PouchDBService) {
    this.pouchDBService.getChangeListener().subscribe(
      item => {
        console.log(`DEBUG pouchDBService item`);
        (item['change']['docs']).forEach(d => {
          let tasklet = d as Tasklet;
          this.tasklets.set(tasklet.id, tasklet);
          this.notify();
        });
      });
  }

  public createTasklet(tasklet: Tasklet) {
    this.tasklets.set(tasklet.id, tasklet);
    this.pouchDBService.put(tasklet.id, tasklet);
    this.notify();
  }

  public updateTasklet(tasklet: Tasklet) {
    console.log(`DEBUG updateTasklet ${tasklet.id}`);
    this.tasklets.set(tasklet.id, tasklet);
    this.pouchDBService.put(tasklet.id, tasklet);
    this.notify();
  }

  public deleteTasklet(tasklet: Tasklet) {
    console.log(`DEBUG deleteTasklet ${tasklet.id}`);
    this.tasklets.delete(tasklet.id);
    this.pouchDBService.remove(tasklet.id, tasklet);
    this.notify();
  }

  /**
   * Retrieves data from PouchDB
   */
  public fetch() {
    console.log(`DEBUG fetch`);
    this.pouchDBService.fetch().then(result => {
        result.rows.forEach(r => {
          let tasklet = r.doc as Tasklet;
          console.log(`DEBUG fetch tasklet ${tasklet.id}`);
          this.tasklets.set(tasklet.id, tasklet);
          console.log(`DEBUG ${this.tasklets.size}`);
        });
        this.notify();
      }, error => {
        if (isDevMode()) {
          console.error(error);
        }
      }
    );
  }

  public getFilteredTasklets(): Tasklet[] {
    this.filteredTasklets = Array.from(this.tasklets.values()).sort((t1: Tasklet, t2: Tasklet) => {
      let date1 = new Date(t1.creationDate).getTime();
      let date2 = new Date(t2.creationDate).getTime();

      return date1 - date2;
    }).filter(c => {
      // Filter cards that match selected tags
      let match = false;

      if (c.tags.length === 0) {
        return true;
      } else {
        c.tags.forEach(ct => {
          this.tags.forEach(t => {
            if (ct.value === t.value && t.checked) {
              match = true;
            }
          });
        });

        return match;
      }
    });

    return this.filteredTasklets;
  }

  /**
   * Returns an array of unique tags
   * @returns {Tag[]}
   */
  getAllTags(): Tag[] {
    console.log(`getAllTags`);
    console.log(`DEBUG ${this.tasklets.size}`);
    let ts = [];

    this.tasklets.forEach(tasklet => {
      tasklet.tags.forEach(tag => {
          let unique = true;
          ts.forEach(t => {
            if (tag.value === t.value) {
              unique = false;
            }
          });

          if (unique) {
            ts.push(tag);
          }
        }
      );
    });

    this.tags = ts.sort((t1, t2) => {
      return (t1.value > t2.value) ? 1 : -1;
    });

    return this.tags;
  }

  public update() {
    this.notify();
  }

  /**
   * Informs subscribers that something has changed
   */
  private notify() {
    console.log(`DEBUG notify`);
    this.tags = this.getAllTags();
    this.filteredTasklets = this.getFilteredTasklets();
    this.taskletsSubject.next(this.filteredTasklets);
  }

  public getTasks(): string[] {
    let tasks = new Map<string, string>();

    this.getFilteredTasklets().forEach(t => {
      if (t.taskName != null) {
        tasks.set(t.taskName, t.taskName);
      }
    });

    return Array.from(tasks.values()).sort();
  }
}
