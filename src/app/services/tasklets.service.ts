import {Injectable, isDevMode} from '@angular/core';
import {Tasklet} from '../model/tasklet.model';
import {Subject} from 'rxjs/Subject';
import {PouchDBService} from './pouchdb.service';

@Injectable()
export class TaskletsService {
  tasklets = new Map<String, Tasklet>();
  taskletsSubject = new Subject<Tasklet[]>();
  filteredTasklets: Tasklet[] = [];

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
    console.log(`DEBUG updateCard ${tasklet.id}`);
    this.tasklets.set(tasklet.id, tasklet);
    this.pouchDBService.put(tasklet.id, tasklet);
    this.notify();
  }

  public deleteTasklet(tasklet: Tasklet) {
    console.log(`DEBUG deleteCard ${tasklet.id}`);
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
        });
        this.notify();
      }, error => {
        if (isDevMode()) {
          console.error(error);
        }
      }
    );
  }

  public getFilteredTasklets() {
    return this.filteredTasklets = Array.from(this.tasklets.values());
  }

  public update() {
    this.notify();
  }

  /**
   * Informs subscribers that something has changed
   */
  private notify() {
    console.log(`DEBUG notify`);
    this.filteredTasklets = this.getFilteredTasklets();
    this.taskletsSubject.next(this.filteredTasklets);
  }
}
