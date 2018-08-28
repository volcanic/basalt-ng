import {Injectable} from '@angular/core';
import {Tasklet} from '../../model/entities/tasklet.model';
import {Task} from '../../model/entities/task.model';
import {Project} from '../../model/entities/project.model';
import {Person} from '../../model/entities/person.model';
import {Tag} from '../../model/entities/tag.model';

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
    return JSON.parse(JSON.stringify(original));
  }

  /**
   * Clones a given array of projects
   * @param {Project[]} original
   * @returns {Project[]} cloned object
   */
  static cloneProjects(original: Project[]): Project[] {
    return JSON.parse(JSON.stringify(original));
  }

  /**
   * Clones a given tasks
   * @param {Task} original
   * @returns {Task} cloned object
   */
  static cloneTask(original: Task): Task {
    return JSON.parse(JSON.stringify(original));
  }

  /**
   * Clones a given tasklet
   * @param {Tasklet} original
   * @returns {Tasklet} cloned object
   */
  static cloneTasklet(original: Tasklet): Tasklet {
    return JSON.parse(JSON.stringify(original));
  }

  /**
   * Clones a given array of projects
   * @param {Tasklet[]} original
   * @returns {Tasklet[]} cloned object
   */
  static cloneTasklets(original: Tasklet[]): Tasklet[] {
    return JSON.parse(JSON.stringify(original));
  }

  /**
   * Clones a given person
   * @param {Person} original
   * @returns {Person}
   */
  static clonePerson(original: Person): Person {
    return JSON.parse(JSON.stringify(original));
  }

  /**
   * Clones a given array of persons
   * @param {Person[]} original
   * @returns {Person[]} cloned object
   */
  static clonePersons(original: Person[]): Person[] {
    return JSON.parse(JSON.stringify(original));
  }

  /**
   * Clones a given tag
   * @param {Tag} original
   * @returns {Tag} cloned object
   */
  static cloneTag(original: Tag): Tag {
    return JSON.parse(JSON.stringify(original));
  }

  /**
   * Clones a given array of tags
   * @param {Tag[]} original
   * @returns {Tag[]} cloned object
   */
  static cloneTags(original: Tag[]): Tag[] {
    return JSON.parse(JSON.stringify(original));
  }
}
