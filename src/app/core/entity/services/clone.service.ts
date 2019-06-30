import {Injectable} from '@angular/core';
import {Tasklet} from '../model/tasklet.model';
import {Person} from '../model/person.model';
import {Description} from '../model/description.model';
import {Tag} from '../model/tag.model';
import {Task} from '../model/task.model';
import {Project} from '../model/project.model';

/**
 * Creates deep copies of objects
 */
@Injectable({
  providedIn: 'root'
})
export class CloneService {

  /**
   * Clones a given project
   * @param original original
   * @returns cloned object
   */
  static cloneProject(original: Project): Project {
    return original != null ? JSON.parse(JSON.stringify(original)) : null;
  }

  /**
   * Clones a given array of projects
   * @param original original
   * @returns cloned object
   */
  static cloneProjects(original: Project[]): Project[] {
    return original != null ? JSON.parse(JSON.stringify(original)) : null;
  }

  /**
   * Clones a given tasks
   * @param original original
   * @returns cloned object
   */
  static cloneTask(original: Task): Task {
    return original != null ? JSON.parse(JSON.stringify(original)) : null;
  }

  /**
   * Clones a given array of tasks
   * @param original original
   * @returns cloned object
   */
  static cloneTasks(original: Task[]): Task[] {
    return original != null ? JSON.parse(JSON.stringify(original)) : null;
  }

  /**
   * Clones a given tasklet
   * @param original original
   * @returns cloned object
   */
  static cloneTasklet(original: Tasklet): Tasklet {
    return original != null ? JSON.parse(JSON.stringify(original)) : null;
  }

  /**
   * Clones a given person
   * @param original original
   * @returns cloned object
   */
  static clonePerson(original: Person): Person {
    return original != null ? JSON.parse(JSON.stringify(original)) : null;
  }

  /**
   * Clones a given array of persons
   * @param original original
   * @returns cloned object
   */
  static clonePersons(original: Person[]): Person[] {
    return original != null ? JSON.parse(JSON.stringify(original)) : null;
  }

  /**
   * Clones a given tag
   * @param original original
   * @returns cloned object
   */
  static cloneTag(original: Tag): Tag {
    return original != null ? JSON.parse(JSON.stringify(original)) : null;
  }

  /**
   * Clones a given array of tags
   * @param original original
   * @returns cloned object
   */
  static cloneTags(original: Tag[]): Tag[] {
    return original != null ? JSON.parse(JSON.stringify(original)) : null;
  }

  /**
   * Clones a given description
   * @param original original
   * @returns cloned object
   */
  static cloneDescription(original: Description): Description {
    return original != null ? JSON.parse(JSON.stringify(original)) : null;
  }
}
