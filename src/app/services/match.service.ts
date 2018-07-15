import {Injectable} from '@angular/core';
import {Tasklet} from '../model/entities/tasklet.model';
import {EntityService} from './entities/entity.service';
import {PlaceholderValues} from '../model/placeholder-values.model';
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
  // Filters
  //

  /**
   * Determines whether a tasklet matches a given set of tags
   *
   * @param tasklet
   * @param tags
   * @returns {boolean}
   */
  public taskletMatchesTags(tasklet: Tasklet, tags: Tag[]): boolean {
    let match = false;

    // Filter tasklets that match selected tags
    tags.forEach(tag => {
        if (tag.checked) {
          if ((tasklet.tags == null || tasklet.tags.length === 0)
            && tag.name === PlaceholderValues.EMPTY_TAG) {
            match = true;
          } else if (tasklet.tags != null && tasklet.tags.length > 0) {
            tasklet.tags.forEach(taskletTag => {
              if (taskletTag.name === tag.name) {
                match = true;
              }
            });
          }
        }
      }
    );

    return match;
  }

  /**
   * Determines whether a tasklet matches a given set of projects
   *
   * @param tasklet
   * @param projects
   * @returns {boolean}
   */
  public taskletMatchesProjects(tasklet: Tasklet, projects: Project[]): boolean {

    return projects.length === 0 || projects.some(p => {
        if (p.checked) {
          const project = this.entityService.getProjectByTasklet(tasklet);

          if ((project != null && project.id != null && p.id === project.id ) ||
            (project == null && p.id === PlaceholderValues.EMPTY_PROJECT_ID)) {
            return true;
          }
        }

        return false;
      });
  }

  /**
   * Determines whether a task matches a given set of tags
   *
   * @param task
   * @param tags
   * @returns {boolean}
   */
  public taskMatchesTags(task: Task, tags: Tag[]): boolean {
    let match = false;

    // Filter task that match selected tags
    tags.forEach(tag => {
        if (tag.checked) {
          if ((task.tags == null || task.tags.length === 0)
            && tag.name === PlaceholderValues.EMPTY_TAG) {
            match = true;
          } else if (task.tags != null && task.tags.length > 0) {
            task.tags.forEach(taskTag => {
              if (taskTag.name === tag.name) {
                match = true;
              }
            });
          }
        }
      }
    );

    return match;
  }

  /**
   * Determines whether a task matches a given set of projects
   *
   * @param task
   * @param projects
   * @returns {boolean}
   */
  public taskMatchesProjects(task: Task, projects: Project[]): boolean {

    return projects.length === 0 || projects.some(p => {
        if (p.checked) {
          const project = this.entityService.getEntityById(task.projectId);

          if ((project != null && project.id != null && p.id === project.id ) ||
            (project == null && p.id === PlaceholderValues.EMPTY_PROJECT_ID)) {
            return true;
          }
        }

        return false;
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

    // Indicate a match if no filter mechanism is used
    if ((items == null || items.trim() === '')) {
      return true;
    }

    return this.splitSearchItems(items).every(i => {
      return this.taskletMatchesSingleItem(tasklet, i);
    });
  }

  /**
   * Determines whether any of tasklet's attributes contain a certain item
   * @param tasklet tasklet
   * @param item single word
   * @returns {boolean}
   */
  public taskletMatchesSingleItem(tasklet: Tasklet, item: string): boolean {

    const task = this.entityService.getTaskByTasklet(tasklet);

    const matchesTaskName = this.taskNameMatchesSingleItem(task, item);
    const matchesDescription = this.descriptionMatchesSingleItem(tasklet.description, item);
    const matchesPersons = this.personsMatchesSingleItem(tasklet.persons, item);
    const matchesTags = this.tagsMatchesSingleItem(tasklet.tags, item);

    return matchesTaskName || matchesDescription || matchesPersons || matchesTags;
  }

  /**
   * Determines whether a task matches every of the specified items
   *
   * @param task value to check
   * @param items multiple words in one string
   * @returns {boolean}
   */
  public taskMatchesEveryItem(task: Task, items: string): boolean {

    // Indicate a match if no filter mechanism is used
    if ((items == null || items.trim() === '')) {
      return true;
    }

    return this.splitSearchItems(items).every(i => {
      return this.taskMatchesSingleItem(task, i);
    });
  }

  /**
   * Determines whether any of task's attributes contain a certain item
   * @param task task
   * @param item single word
   * @returns {boolean}
   */
  public taskMatchesSingleItem(task: Task, item: string): boolean {

    const matchesTaskName = this.taskNameMatchesSingleItem(task, item);
    const matchesDescription = this.descriptionMatchesSingleItem(task.description, item);
    const matchesTags = this.tagsMatchesSingleItem(task.tags, item);

    return matchesTaskName || matchesDescription || matchesTags;
  }

  //
  // Search item parts
  //

  private taskNameMatchesSingleItem(task: Task, item: string): boolean {

    return (task != null) ? this.textMatchesSingleItem(task.name, item) : false;
  }

  private descriptionMatchesSingleItem(description: Description, item: string): boolean {
    return description.value != null && description.value.split('\n').some(s => {
        return this.textMatchesSingleItem(s, item);
      });
  }

  private personsMatchesSingleItem(persons: Person[], item: string): boolean {
    if (persons != null) {
      return persons.some(p => {
        return this.textMatchesSingleItem(p.name, item);
      });
    }

    return false;
  }

  private tagsMatchesSingleItem(tags: Tag[], item: string): boolean {
    if (tags != null) {
      return tags.some(t => {
        return this.textMatchesSingleItem(t.name, item);
      });
    }

    return false;
  }

  public textMatchesAnyItem(text: string, items: string): boolean {
    if (items == null || items.toString().trim() === '') {
      return false;
    }

    return this.splitSearchItems(items).some(i => {
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
    if (items == null) {
      return false;
    }

    return this.splitSearchItems(items).some(t => {
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
    if (value == null || item == null || item.trim() === '') {
      return false;
    }

    return this.normalize(value).includes(this.normalize(item.toString()));
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
