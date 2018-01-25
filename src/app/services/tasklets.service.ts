import {Injectable, isDevMode} from '@angular/core';
import {Tasklet} from '../model/tasklet.model';
import {Subject} from 'rxjs/Subject';
import {PouchDBService} from './pouchdb.service';
import {Tag} from '../model/tag.model';

@Injectable()
export class TaskletsService {
  tasklets = new Map<String, Tasklet>();
  taskletsSubject = new Subject<Tasklet[]>();

  // Suggestions
  suggestedTags: Tag[] = [];
  suggestedSearchItems = [];

  constructor(private pouchDBService: PouchDBService) {
    this.pouchDBService.getChangeListener().subscribe(
      item => {
        console.log(`DEBUG pouchDBService item`);
        (item['change']['docs']).forEach(d => {
          const tasklet = d as Tasklet;
          this.tasklets.set(tasklet.id, tasklet);
          this.update();
        });
      });
  }

  public createTasklet(tasklet: Tasklet) {
    this.tasklets.set(tasklet.id, tasklet);
    this.pouchDBService.put(tasklet.id, tasklet);
    this.update();
  }

  public updateTasklet(tasklet: Tasklet) {
    console.log(`DEBUG updateTasklet ${tasklet.id}`);
    this.tasklets.set(tasklet.id, tasklet);
    this.pouchDBService.put(tasklet.id, tasklet);
    this.update();
  }

  public deleteTasklet(tasklet: Tasklet) {
    console.log(`DEBUG deleteTasklet ${tasklet.id}`);
    this.tasklets.delete(tasklet.id);
    this.pouchDBService.remove(tasklet.id, tasklet);
    this.update();
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
        this.update();
      }, error => {
        if (isDevMode()) {
          console.error(error);
        }
      }
    );
  }

  getSuggestedSearchItems(): string[] {
    this.suggestedSearchItems = [];

    this.tasklets.forEach(t => {
      t.text.split('\n').forEach(v => {
        if (v.trim() !== '') {
          this.suggestedSearchItems.push(v.trim().replace(/(^-)/g, ''));
        }
      });
    });

    return this.suggestedSearchItems;
  }

  /**
   * Returns an array of unique suggestedTags
   * @returns {Tag[]}
   */
  getSuggestedTagsByTasklets(tasklets: Tasklet[]): Tag[] {
    const ts = [];

    tasklets.forEach(tasklet => {
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

    return ts.sort((t1, t2) => {
      return (t1.value > t2.value) ? 1 : -1;
    });
  }

  /**
   * Informs subscribers that something has changed
   */

  public update() {
    this.taskletsSubject.next(Array.from(this.tasklets.values()));
    this.suggestedSearchItems = this.getSuggestedSearchItems();
  }

  public getTasks(): string[] {
    const tasks = new Map<string, string>();

    this.tasklets.forEach(t => {
      if (t.taskName != null) {
        tasks.set(t.taskName, t.taskName);
      }
    });

    return Array.from(tasks.values()).sort();
  }
}
