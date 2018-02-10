import {Injectable, isDevMode} from '@angular/core';
import {Tasklet} from '../model/tasklet.model';
import {Subject} from 'rxjs/Subject';
import {PouchDBService} from './pouchdb.service';
import {Person} from '../model/person.model';

@Injectable()
export class TaskletsService {
  tasklets = new Map<String, Tasklet>();
  taskletsSubject = new Subject<Tasklet[]>();

  // Suggestions
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
    console.log(`DEBUG createTasklet ${JSON.stringify(tasklet)}`);
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

      if (t.taskName != null) {
        this.suggestedSearchItems.push(t.taskName.trim().replace(/(^-)/g, ''));
      }
    });

    return this.suggestedSearchItems;
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

  public getPersons(): Person[] {
    const persons = new Map<string, Person>();

    this.tasklets.forEach(t => {
      if (t.persons != null) {
        t.persons.forEach(p => {
          persons.set(p.name, p);
        });
      }
    });

    return Array.from(persons.values()).sort();
  }
}
