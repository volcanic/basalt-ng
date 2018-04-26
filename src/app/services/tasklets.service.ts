import {Injectable, isDevMode} from '@angular/core';
import {Tasklet} from '../model/tasklet.model';
import {Subject} from 'rxjs/Subject';
import {PouchDBService} from './pouchdb.service';
import {Person} from '../model/person.model';
import {TASKLET_TYPE} from '../model/tasklet-type.enum';
import {TaskletDailyScrum} from '../model/tasklet-daily-scrum.model';
import {Project} from '../model/project.model';
import {Tag} from '../model/tag.model';

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
          // console.debug(`TRACE fetch tasklet ${tasklet.id}`);
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

  /**
   * Informs subscribers that something has changed
   */

  public update() {
    this.taskletsSubject.next(Array.from(this.tasklets.values()).sort((t1: Tasklet, t2: Tasklet) => {
      const date1 = new Date(t1.creationDate).getTime();
      const date2 = new Date(t2.creationDate).getTime();

      return date2 - date1;
    }));
    this.suggestedSearchItems = this.getSuggestedSearchItems();
  }

  public downloadTasklets() {
    const fileContents = JSON.stringify(Array.from(this.tasklets.values()));
    const filename = 'tasklets.basalt';
    const filetype = 'text/plain';

    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(fileContents));
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  }

  public showTasklets() {
    const fileContents = JSON.stringify(Array.from(this.tasklets.values()));
    const filename = 'tasklets.basalt';
    const filetype = 'text/plain';

    const blob = new Blob([fileContents], {type: filetype});
    const url = window.URL.createObjectURL(blob);
    window.open(url);
  }

  public getSuggestedSearchItems(): string[] {
    this.suggestedSearchItems = [];

    Array.from(this.tasklets.values()).sort((t1, t2) => {
      return (new Date(t1.creationDate) > new Date(t2.creationDate)) ? 1 : -1;
    }).forEach(t => {
      t.text.split('\n').forEach(v => {
        if (v.trim() !== '') {
          this.suggestedSearchItems.push(v.trim().replace(/(^-)/g, ''));
        }
      });

      if (t.taskName != null) {
        this.suggestedSearchItems.push(t.taskName.trim().replace(/(^-)/g, ''));
      }
    });

    return this.suggestedSearchItems.reverse();
  }

  public getTags(): Map<string, Tag> {
    return this.getTagsByTasklets(Array.from(this.tasklets.values()));
  }

  public getTagsByTasklets(tasklets: Tasklet[]): Map<string, Tag> {
    const tags = new Map<string, Tag>();

    Array.from(tasklets.values()).sort((t1, t2) => {
      return (new Date(t1.creationDate) > new Date(t2.creationDate)) ? -1 : 1;
    }).forEach(tasklet => {
      if (tasklet.tags != null) {
        tasklet.tags.forEach(t => {
          if (t != null && t.value != null && t.value.length > 0) {
            // Deep copy
            const tag = new Tag(t.value, t.checked);

            tags.set(tag.value, tag);
          }
        });
      }
    });

    return tags;
  }

  public getProjects(): Project[] {
    return this.getProjectsByTasklets(Array.from(this.tasklets.values()));
  }

  public getProjectsByTasklets(tasklets: Tasklet[]): Project[] {
    const projects = new Map<string, Project>();

    Array.from(tasklets.values()).sort((t1, t2) => {
      return (new Date(t1.creationDate) > new Date(t2.creationDate)) ? -1 : 1;
    }).forEach(t => {
      if (t.project != null && t.project.value != null && t.project.value.length > 0) {
        // Deep copy
        const project = new Project(t.project.value, t.project.checked);

        projects.set(project.value, project);
      }
    });

    return Array.from(projects.values());
  }

  public getTasks(): string[] {
    const tasks = new Map<string, string>();

    Array.from(this.tasklets.values()).sort((t1, t2) => {
      return (new Date(t1.creationDate) > new Date(t2.creationDate)) ? 1 : -1;
    }).forEach(t => {
      if (t.taskName != null) {
        tasks.set(t.taskName, t.taskName);
      }
    });

    return Array.from(tasks.values()).reverse();
  }

  /**
   * Returns a list of recent daily scrum activities of a given person
   * @param person given person
   * @returns {string[]}
   */
  public getDailyScrumActivities(person: Person): string[] {
    const dailyScrumActivities = new Map<string, string>();

    if (person != null) {
      (Array.from(this.tasklets.values()).filter(t => {
        return t.type === TASKLET_TYPE.DAILY_SCRUM;
      }).sort((t1, t2) => {
        return (new Date(t1.creationDate) > new Date(t2.creationDate)) ? 1 : -1;
      }) as TaskletDailyScrum[]).forEach(t => {
        t.participants.filter(p => {
          return p.person.name === person.name;
        }).forEach(p => {
          p.activities.filter(a => {
            return a.topic.length !== 0;
          }).forEach(a => {
            dailyScrumActivities.set(a.topic, a.topic);
          });
        });
      });
    }

    return Array.from(dailyScrumActivities.values()).reverse();
  }

  public getPersons(): Person[] {
    const persons = new Map<string, Person>();

    Array.from(this.tasklets.values()).sort((t1, t2) => {
      return (new Date(t1.creationDate) > new Date(t2.creationDate)) ? -1 : 1;
    }).forEach(t => {
      if (t.persons != null) {
        t.persons.forEach(p => {
          persons.set(p.name, p);
        });
      }
    });

    return Array.from(persons.values()).reverse();
  }
}
