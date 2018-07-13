import {Injectable} from '@angular/core';
import {Tasklet} from '../../model/entities/tasklet.model';
import {Task} from '../../model/entities/task.model';
import {Project} from '../../model/entities/project.model';
import {Person} from '../../model/person.model';
import {Tag} from '../../model/tag.model';

@Injectable({
  providedIn: 'root'
})
export class CloneService {

  constructor() {
  }

  cloneProject(original: Project): Project {
    return JSON.parse(JSON.stringify(original));
  }

  cloneTask(original: Task): Task {
    return JSON.parse(JSON.stringify(original));
  }

  cloneTasklet(original: Tasklet): Tasklet {
    return JSON.parse(JSON.stringify(original));
  }

  cloneTasklets(original: Tasklet[]): Tasklet[] {
    return JSON.parse(JSON.stringify(original));
  }

  clonePerson(original: Person): Person {
    return JSON.parse(JSON.stringify(original));
  }

  cloneTag(original: Tag): Tag {
    return JSON.parse(JSON.stringify(original));
  }
}
