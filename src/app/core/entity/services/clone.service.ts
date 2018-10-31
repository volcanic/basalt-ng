import {Injectable} from '@angular/core';
import {Tasklet} from '../model/tasklet.model';
import {Task} from '../model/task.model';
import {Project} from '../model/project.model';
import {Person} from '../model/person.model';
import {Tag} from '../model/tag.model';

/**
 * Creates deep copies of objects
 */
@Injectable({
  providedIn: 'root'
})
export class CloneService {

  /**
   * Clones a given project
   * @param {Project} original
   * @returns {Project} cloned object
   */
  static cloneProject(original: Project): Project {
    return original != null ? JSON.parse(JSON.stringify(original)) : null;
  }

  /**
   * Clones a given array of projects
   * @param {Project[]} original
   * @returns {Project[]} cloned object
   */
  static cloneProjects(original: Project[]): Project[] {
    return original != null ? JSON.parse(JSON.stringify(original)) : null;
  }

  /**
   * Clones a given tasks
   * @param {Task} original
   * @returns {Task} cloned object
   */
  static cloneTask(original: Task): Task {
    return original != null ? JSON.parse(JSON.stringify(original)) : null;
  }

  /**
   * Clones a given array of tasks
   * @param {Task[]} original
   * @returns {Task[]} cloned object
   */
  static cloneTasks(original: Task[]): Task[] {
    return original != null ? JSON.parse(JSON.stringify(original)) : null;
  }

  /**
   * Clones a given tasklet
   * @param {Tasklet} original
   * @returns {Tasklet} cloned object
   */
  static cloneTasklet(original: Tasklet): Tasklet {
    return original != null ? JSON.parse(JSON.stringify(original)) : null;
  }

  /**
   * Clones a given array of projects
   * @param {Tasklet[]} original
   * @returns {Tasklet[]} cloned object
   */
  static cloneTasklets(original: Tasklet[]): Tasklet[] {
    return original != null ? JSON.parse(JSON.stringify(original)) : null;
  }

  /**
   * Clones a given person
   * @param {Person} original
   * @returns {Person}
   */
  static clonePerson(original: Person): Person {
    return original != null ? JSON.parse(JSON.stringify(original)) : null;
  }

  /**
   * Clones a given array of persons
   * @param {Person[]} original
   * @returns {Person[]} cloned object
   */
  static clonePersons(original: Person[]): Person[] {
    return original != null ? JSON.parse(JSON.stringify(original)) : null;
  }

  /**
   * Clones a given tag
   * @param {Tag} original
   * @returns {Tag} cloned object
   */
  static cloneTag(original: Tag): Tag {
    return original != null ? JSON.parse(JSON.stringify(original)) : null;
  }

  /**
   * Clones a given array of tags
   * @param {Tag[]} original
   * @returns {Tag[]} cloned object
   */
  static cloneTags(original: Tag[]): Tag[] {
    return original != null ? JSON.parse(JSON.stringify(original)) : null;
  }
}
