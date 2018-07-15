import {Injectable} from '@angular/core';
import {Tasklet} from '../model/entities/tasklet.model';
import {EntityService} from './entities/entity.service';
import {Project} from '../model/entities/project.model';
import {Task} from '../model/entities/task.model';
import {Tag} from '../model/tag.model';
import {Description} from '../model/description.model';
import {Person} from '../model/person.model';


@Injectable()
export class MatchService {

  constructor(private entityService: EntityService) {
  }

  //
  // Tags
  //

  /**
   * Determines whether a tasklet matches a given set of tags
   *
   * @param tasklet
   * @param tags
   * @param tagsNone
   * @returns {boolean}
   */
  public taskletMatchesTags(tasklet: Tasklet, tags: Tag[], tagsNone: boolean): boolean {

    return ((tasklet.tags == null || tasklet.tags.length === 0) && tagsNone)
      || tasklet.tags.some(tag => {
        return this.tagMatchesTags(tag, tags, tagsNone);
      });
  }

  /**
   * Determines whether a task matches a given set of tags
   *
   * @param task
   * @param tags
   * @param tagsNone
   * @returns {boolean}
   */
  public taskMatchesTags(task: Task, tags: Tag[], tagsNone: boolean): boolean {

    return ((task.tags == null || task.tags.length === 0) && tagsNone)
      || task.tags.some(tag => {
        return this.tagMatchesTags(tag, tags, tagsNone);
      });
  }

  /**
   * Determines whether a tag matches a given set of tags
   *
   * @param tag
   * @param tags
   * @param tagsNone
   * @returns {boolean}
   */
  private tagMatchesTags(tag: Tag, tags: Tag[], tagsNone: boolean) {
    return (tag == null && tagsNone)
      || tags.length === 0
      || tags.some(t => {
        return t.checked && tag != null && tag.name != null && t.name === tag.name;
      });
  }

  //
  // Projects
  //

  /**
   * Determines whether a tasklet matches a given set of projects
   *
   * @param tasklet
   * @param projects
   * @param projectsNone
   * @returns {boolean}
   */
  public taskletMatchesProjects(tasklet: Tasklet, projects: Project[], projectsNone: boolean): boolean {

    const project = this.entityService.getProjectByTasklet(tasklet);

    return this.projectMatchesProjects(project, projects, projectsNone);
  }

  /**
   * Determines whether a task matches a given set of projects
   *
   * @param task
   * @param projects
   * @param projectsNone
   * @returns {boolean}
   */
  public taskMatchesProjects(task: Task, projects: Project[], projectsNone: boolean): boolean {

    const project = this.entityService.getEntityById(task.projectId) as Project;

    return this.projectMatchesProjects(project, projects, projectsNone);
  }

  /**
   * Determines whether a project matches a given set of projects
   *
   * @param project
   * @param projects
   * @param projectsNone
   * @returns {boolean}
   */
  public projectMatchesProjects(project: Project, projects: Project[], projectsNone: boolean) {
    return (project == null && projectsNone)
      || projects.length === 0
      || projects.some(p => {
        return p.checked && project != null && project.id != null && p.id === project.id;
      });
  }

  //
  // Search item
  //

  /**
   * Determines whether a tasklet matches every of the specified items
   *
   * @param tasklet value to check
   * @param items multiple words in one string
   * @returns {boolean}
   */
  public taskletMatchesEveryItem(tasklet: Tasklet, items: string): boolean {

    const task = this.entityService.getTaskByTasklet(tasklet);

    return items == null || items.trim() === '' || this.splitSearchItems(items).every(item => {

        return this.taskNameMatchesSingleItem(task, item)
          || this.descriptionMatchesSingleItem(tasklet.description, item)
          || this.personsMatchesSingleItem(tasklet.persons, item)
          || this.tagsMatchesSingleItem(tasklet.tags, item);
      });
  }

  /**
   * Determines whether a task matches every of the specified items
   *
   * @param task value to check
   * @param items multiple words in one string
   * @returns {boolean}
   */
  public taskMatchesEveryItem(task: Task, items: string): boolean {

    return items == null || items.trim() === '' || this.splitSearchItems(items).every(item => {
        return this.taskNameMatchesSingleItem(task, item)
          || this.descriptionMatchesSingleItem(task.description, item)
          || this.tagsMatchesSingleItem(task.tags, item);
      });
  }

  /**
   * Determines whether a project matches every of the specified items
   *
   * @param project value to check
   * @param items multiple words in one string
   * @returns {boolean}
   */
  public projectMatchesEveryItem(project: Project, items: string): boolean {

    return items == null || items.trim() === '' || this.splitSearchItems(items).every(item => {
        return this.projectNameMatchesSingleItem(project, item);
      });
  }

  //
  // Search item parts
  //

  private taskNameMatchesSingleItem(task: Task, item: string): boolean {

    return (task != null) ? this.textMatchesSingleItem(task.name, item) : false;
  }

  private projectNameMatchesSingleItem(project: Project, item: string): boolean {

    return (project != null) ? this.textMatchesSingleItem(project.name, item) : false;
  }

  private descriptionMatchesSingleItem(description: Description, item: string): boolean {

    return description.value != null && description.value.split('\n').some(s => {
        return this.textMatchesSingleItem(s, item);
      });
  }

  private personsMatchesSingleItem(persons: Person[], item: string): boolean {

    return persons != null && persons.some(p => {
        return this.textMatchesSingleItem(p.name, item);
      });
  }

  private tagsMatchesSingleItem(tags: Tag[], item: string): boolean {

    return tags != null && tags.some(t => {
        return this.textMatchesSingleItem(t.name, item);
      });
  }

  public textMatchesAnyItem(text: string, items: string): boolean {

    return items != null && items.toString().trim() !== '' && this.splitSearchItems(items).some(i => {
        return this.textMatchesSingleItem(text, i);
      });
  }

  public textMatchesSingleItem(text: string, item: string): boolean {

    return this.valueMatchesSingleItem(text, item);
  }


  /**
   * Determines whether a value contains a specific item
   *
   * @param value value to check
   * @param items multiple words in one string
   * @returns {boolean}
   */
  public valueMatchesAnyItem(value: string, items: string): boolean {

    return items != null && this.splitSearchItems(items).some(t => {
        return this.valueMatchesSingleItem(value, t);
      });
  }

  /**
   * Determines whether a value contains a specific item
   *
   * @param value value to check
   * @param item single word
   * @returns {boolean}
   */
  public valueMatchesSingleItem(value: string, item: string): boolean {

    return value != null
      && item != null
      && item.trim() !== ''
      && this.normalize(value).includes(this.normalize(item.toString()));
  }

  /**
   * Normalizes a string in order to make comparison less prone to errors
   * @param value
   */
  public normalize(value: string): string {

    return (value != null) ? value
      .toString()
      .trim()
      .toLowerCase()
      .replace(new RegExp('ä', 'g'), 'ae')
      .replace(new RegExp('ö', 'g'), 'oe')
      .replace(new RegExp('ü', 'g'), 'ue')
      .replace(new RegExp('ß', 'g'), 'ss')
      .replace(new RegExp('ß', 'g'), 'ss')
      .replace(new RegExp('\\.', 'g'), 'dot')
      .replace(new RegExp('\\+', 'g'), 'plus')
      .replace(new RegExp('\\/', 'g'), 'slash')
      .replace(new RegExp('&', 'g'), 'and')
      .replace(new RegExp('#', 'g'), 'sharp') : '';
  }

  /**
   * Splits a item into an array of items using space as an delimiter where words can be grouped by surrounding them
   * with double quotes
   * @param items
   */
  private splitSearchItems(items: string): string[] {

    if (items == null) {
      return [];
    }

    const itemArray = this.normalize(items).match(/\w+|"[^"]+"/g);

    if (itemArray == null) {
      return [];
    }

    let i = itemArray.length;
    while (i--) {
      itemArray[i] = itemArray[i].replace(/"/g, '');
    }

    return itemArray;
  }
}
