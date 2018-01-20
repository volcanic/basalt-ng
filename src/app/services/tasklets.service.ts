import {Injectable, isDevMode} from '@angular/core';
import {Tasklet} from '../model/tasklet.model';
import {Subject} from 'rxjs/Subject';
import {PouchDBService} from './pouchdb.service';
import {Tag} from '../model/tag.model';
import {MatchService} from './match.service';

@Injectable()
export class TaskletsService {
  tasklets = new Map<String, Tasklet>();
  filteredTasklets = [];

  taskletsSubject = new Subject<Tasklet[]>();
  searchItemSubject = new Subject<string>();

  tags: Tag[] = [];

  searchItems = [];
  searchItem = '';

  constructor(private pouchDBService: PouchDBService,
              private matchService: MatchService) {
    this.pouchDBService.getChangeListener().subscribe(
      item => {
        console.log(`DEBUG pouchDBService item`);
        (item['change']['docs']).forEach(d => {
          const tasklet = d as Tasklet;
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
    this.tasklets.clear();
    this.pouchDBService.fetch().then(result => {
        result.rows.forEach(r => {
          const tasklet = r.doc as Tasklet;
          console.log(`DEBUG fetch tasklet ${tasklet.id}`);
          this.tasklets.set(tasklet.id, tasklet);
        });
        this.notify();
      }, error => {
        if (isDevMode()) {
          console.error(error);
        }
      }
    );
    this.searchItemSubject.subscribe(searchItem => {
      this.searchItem = searchItem;
    });
  }

  setSearchItem(searchItem: string) {
    this.searchItemSubject.next(searchItem);
    this.notify();
  }

  public getFilteredTasklets(): Tasklet[] {
    this.filteredTasklets = Array.from(this.tasklets.values()).filter(tasklet => {
      // Filter tasklets that match selected tags
      if (tasklet.tags != null) {
        let match = false;

        if (tasklet.tags.length === 0) {
          return true;
        } else {
          tasklet.tags.forEach(taskletTag => {
            this.tags.forEach(tag => {
              if (taskletTag.value === tag.value && tag.checked) {
                match = true;
              }
            });
          });

          return match;
        }
      } else {
        return true;
      }
    }).filter(t => {
      console.log(`DEBUG searchItem ${this.searchItem}`);
      if (this.searchItem !== '') {
        return this.matchService.taskletMatchesEveryItem(t, this.searchItem);
      } else {
        return true;
      }
    }).sort((t1: Tasklet, t2: Tasklet) => {
      const date1 = new Date(t1.creationDate).getTime();
      const date2 = new Date(t2.creationDate).getTime();

      return date1 - date2;
    });

    return this.filteredTasklets;
  }

  getSearchItems(): string[] {
    this.searchItems = [];

    this.tasklets.forEach(t => {
      t.text.split('\n').forEach(v => {
        if (v.trim() !== '') {
          this.searchItems.push(v.trim().replace(/(^-)/g, ''));
        }
      });
    });

    return this.searchItems;
  }

  /**
   * Returns an array of unique tags
   * @returns {Tag[]}
   */
  getAllTags(): Tag[] {
    const ts = [];

    this.tasklets.forEach(tasklet => {
      if (tasklet.tags != null) {
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
      }
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
    this.tags = this.getAllTags();
    this.filteredTasklets = this.getFilteredTasklets();
    this.taskletsSubject.next(this.filteredTasklets);
    this.searchItems = this.getSearchItems();
  }

  public getTasks(): string[] {
    const tasks = new Map<string, string>();

    this.getFilteredTasklets().forEach(t => {
      if (t.taskName != null) {
        tasks.set(t.taskName, t.taskName);
      }
    });

    return Array.from(tasks.values()).sort();
  }
}
