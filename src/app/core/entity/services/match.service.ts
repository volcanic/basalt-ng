import {Injectable} from '@angular/core';
import {Tasklet} from '../model/tasklet.model';
import {Project} from '../model/project.model';
import {Task} from '../model/task.model';
import {Tag} from '../model/tag.model';
import {Description} from '../model/description.model';
import {Person} from '../model/person.model';
import {ProjectService} from './project.service';
import {TaskletService} from './tasklet.service';
import {TaskService} from './task.service';
import {DateService} from './date.service';
import {TagService} from './tag.service';
import {PersonService} from './person.service';
import {MeetingMinuteItem} from '../model/meeting-minutes/meeting-minute-item.model';
import {DailyScrumItem} from '../model/daily-scrum/daily-scrum-item.model';

/**
 * Handles matching
 */
@Injectable()
export class MatchService {

  /**
   * Constructor
   * @param {ProjectService} projectService
   * @param {TaskService} taskService
   * @param {TaskletService} taskletService
   * @param {TagService} tagService
   * @param {PersonService} personService
   */
  constructor(private projectService: ProjectService,
              private taskService: TaskService,
              private taskletService: TaskletService,
              private tagService: TagService,
              private personService: PersonService) {
  }

  /**
   * Normalizes a string in order to make comparison less prone to errors
   * @param {string} value input value
   * @returns {string} normalized string
   */
  static normalize(value: string): string {
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
   * Compares two string values
   * @param {string} value1 first value
   * @param {string} value2 second value
   * @returns {number} 1 if the first values comes after the second one, otherwise -1
   */
  static compare(value1: string, value2: string) {
    return MatchService.normalize(value1) > MatchService.normalize(value2) ? 1 : -1;
  }

  //
  // String
  //

  /**
   * Determines whether a value contains a specific item
   * @param value value to check
   * @param item single word
   * @returns {boolean} true if value includes word
   */
  static valueMatchesSingleItem(value: string, item: string): boolean {
    return value != null
      && item != null
      && item.trim() !== ''
      && MatchService.normalize(value).includes(MatchService.normalize(item.toString()));
  }

  /**
   * Splits a item into an array of items using space as an delimiter where words can be grouped by surrounding them
   * with double quotes
   * @param {string} items search items formatted as a single string
   * @returns {string[]} array of search items
   */
  static splitSearchItems(items: string): string[] {

    if (items == null) {
      return [];
    }

    const itemArray = MatchService.normalize(items).match(/\w+|"[^"]+"/g);

    if (itemArray == null) {
      return [];
    }

    let i = itemArray.length;
    while (i--) {
      itemArray[i] = itemArray[i].replace(/"/g, '');
    }

    return itemArray;
  }

  /**
   * Determines whether a text matches a single item
   * @param {string} text text to check
   * @param {string} item search item
   * @returns {boolean} true if text matches search item
   */
  static textMatchesSingleItem(text: string, item: string): boolean {
    return MatchService.valueMatchesSingleItem(text, item);
  }

  /**
   * Determines whether a task matches a single item
   * @param {Task} task task to check
   * @param {string} item search item
   * @returns {boolean} true if task matches search item
   */
  static taskNameMatchesSingleItem(task: Task, item: string): boolean {
    return (task != null) ? MatchService.textMatchesSingleItem(task.name, item) : false;
  }

  /**
   * Determines whether a project matches a single item
   * @param {Project} project to check
   * @param {string} item search item
   * @returns {boolean} true if project matches search item
   */
  static projectNameMatchesSingleItem(project: Project, item: string): boolean {
    return (project != null) ? MatchService.textMatchesSingleItem(project.name, item) : false;
  }

  /**
   * Determines whether a tag's name matches a single item
   * @param {Tag} tag tag to check
   * @param {string} item search item
   * @returns {boolean} true if tag's name matches search item
   */
  static tagNameMatchesSingleItem(tag: Tag, item: string): boolean {
    return (tag != null) ? MatchService.textMatchesSingleItem(tag.name, item) : false;
  }

  /**
   * Determines whether a person's name matches a single item
   * @param {Person} person person to check
   * @param {string} item search item
   * @returns {boolean} true if person's name matches search item
   */
  static personNameMatchesSingleItem(person: Person, item: string): boolean {
    return (person != null) ? MatchService.textMatchesSingleItem(person.name, item) : false;
  }

  //
  // Tasklets
  //

  /**
   * Determines if a tasklet matches a given date
   * @param {Tasklet} tasklet to check
   * @param {Date} date focus date
   * @returns {boolean} true if the tasklet matches given date
   */
  static taskletMatchesDate(tasklet: Tasklet, date: Date) {
    return new Date(tasklet.creationDate) > new Date(DateService.getDayStart(date))
      && new Date(tasklet.creationDate) < new Date(DateService.getDayEnd(date));
  }

  //
  // Tags
  //

  /**
   * Determines whether a tasklet matches a given set of tags
   * @param tasklet tasklet to check
   * @param tags array of tags the tasklet should contain
   * @param tagsNone include tasklets without tag if true
   * @returns {boolean} true if tasklet matches given tags
   */
  public taskletMatchesTags(tasklet: Tasklet, tags: Tag[], tagsNone: boolean): boolean {
    return ((tasklet.tagIds == null || tasklet.tagIds.length === 0) && tagsNone)
      || (tasklet.tagIds != null && tasklet.tagIds.map(id => {
        return this.tagService.getTagById(id);
      }).filter(tag => {
        return tag != null;
      }).some(tag => {
        return this.tagMatchesTags(tag, tags, tagsNone);
      }));
  }

  /**
   * Determines whether a tasklet matches a given set of tags
   * @param task task to check
   * @param tags array of tags the task should contain
   * @param tagsNone include tasks without tag if true
   * @returns {boolean} true if task matches given tags
   */
  public taskMatchesTags(task: Task, tags: Tag[], tagsNone: boolean): boolean {
    return ((task.tagIds == null || task.tagIds.length === 0) && tagsNone)
      || (task.tagIds != null && task.tagIds.map(id => {
        return this.tagService.getTagById(id);
      }).filter(tag => {
        return tag != null;
      }).some(tag => {
        return this.tagMatchesTags(tag, tags, tagsNone);
      }));
  }

  /**
   * Determines whether a tag matches a given set of tags
   * @param tag tag to check
   * @param tags array of tags the tag should be contained in
   * @param tagsNone whether true should be returned if tag is null
   * @returns {boolean} true if tag matches given tags
   */
  public tagMatchesTags(tag: Tag, tags: Tag[], tagsNone: boolean) {
    return (tag == null && tagsNone)
      || tags.length === 0
      || tags.some(t => {
        return t.checked && tag != null && tag.id != null && t.id === tag.id;
      });
  }

  //
  // Tasks
  //

  /**
   * Determines whether a tasklet matches a given set of tasks
   * @param tasklet tasklet to check
   * @param tasks array of tasks tasklet should match
   * @param tasksNone whether tasklets without task shall be included
   * @returns {boolean} true if tasklet matches given tasks
   */
  public taskletMatchesTasks(tasklet: Tasklet, tasks: Task[], tasksNone: boolean): boolean {
    const task = this.taskletService.getTaskByTasklet(tasklet);

    return this.taskMatchesTasks(task, tasks, tasksNone);
  }

  /**
   * Determines whether a task matches a given set of tasks
   * @param task task to check
   * @param tasks array of tasks task should match
   * @param tasksNone whether tasks without project shall be included
   * @returns {boolean} true if task matches given tasks
   */
  public taskMatchesTasks(task: Task, tasks: Task[], tasksNone: boolean): boolean {
    return (task == null && tasksNone)
      || tasks.length === 0
      || tasks.some(t => {
        return t.checked && task != null && task.id != null && t.id === task.id;
      });
  }

  /**
   * Determines whether a project matches a given set of project
   * @param project project to check
   * @param tasks array of tasks the project should be contained in
   * @param tasksNone whether true should be returned if project is null
   * @returns {boolean} true if project matches given tasks
   */
  public projectMatchesTasks(project: Project, tasks: Task[], tasksNone: boolean) {
    return (project == null && tasksNone)
      || tasks.length === 0
      || tasks.some(t => {

        return t.checked && project != null && project.id != null && t.projectId === project.id;
      });
  }

  //
  // Projects
  //

  /**
   * Determines whether a tasklet matches a given set of projects
   * @param tasklet tasklet to check
   * @param projects array of projects tasklet should match
   * @param projectsNone whether tasklets without project shall be included
   * @returns {boolean} true if tasklet matches given projects
   */
  public taskletMatchesProjects(tasklet: Tasklet, projects: Project[], projectsNone: boolean): boolean {
    const project = this.taskletService.getProjectByTasklet(tasklet);
    return this.projectMatchesProjects(project, projects, projectsNone);
  }

  /**
   * Determines whether a task matches a given set of projects
   * @param task task to check
   * @param projects array of projects task should match
   * @param projectsNone whether tasks without project shall be included
   * @returns {boolean} true if task matches given projects
   */
  public taskMatchesProjects(task: Task, projects: Project[], projectsNone: boolean): boolean {
    const project = this.projectService.projects.get(task.projectId);

    return this.projectMatchesProjects(project, projects, projectsNone);
  }

  /**
   * Determines whether a project matches a given set of project
   * @param project project to check
   * @param projects array of projects the project should be contained in
   * @param projectsNone whether true should be returned if project is null
   * @returns {boolean} true if project matches given projects
   */
  public projectMatchesProjects(project: Project, projects: Project[], projectsNone: boolean) {
    return (project == null && projectsNone)
      || projects.length === 0
      || projects.some(p => {
        return p.checked && project != null && project.id != null && p.id === project.id;
      });
  }

  //
  // Persons
  //

  /**
   * Determines whether a tasklet matches a given set of persons
   * @param tasklet tasklet to check
   * @param persons array of persons tasklet should match
   * @param personsNone whether tasklets without person shall be included
   * @returns {boolean} true if tasklet matches given persons
   */
  public taskletMatchesPersons(tasklet: Tasklet, persons: Person[], personsNone: boolean): boolean {
    return ((tasklet.personIds == null || tasklet.personIds.length === 0) && personsNone)
      || (tasklet.personIds != null && tasklet.personIds.map(id => {
        return this.personService.getPersonById(id);
      }).filter(person => {
        return person != null;
      }).some(person => {
        return this.personMatchesPersons(person, persons, personsNone);
      }));
  }

  /**
   * Determines whether a task matches a given set of persons
   * @param task task to check
   * @param persons array of persons task should match
   * @param personsNone whether tasks without person shall be included
   * @returns {boolean} true if task matches given persons
   */
  public taskMatchesPersons(task: Task, persons: Person[], personsNone: boolean): boolean {
    return (task.delegatedToId == null && personsNone)
      || (task.delegatedToId != null
        && this.personMatchesPersons(this.personService.getPersonById(task.delegatedToId), persons, personsNone));
  }

  /**
   * Determines whether a task matches a given set of persons
   * @param person person to check
   * @param persons array of persons task should match
   * @param personsNone whether tasks without person shall be included
   * @returns {boolean} true if task matches given persons
   */
  public personMatchesPersons(person: Person, persons: Person[], personsNone: boolean) {
    return (person == null && personsNone)
      || persons.length === 0
      || persons.some(p => {
        return p.checked && person != null && person.name != null && p.name === person.name;
      });
  }

  //
  // Search item
  //

  /**
   * Determines whether a tasklet matches every of the specified items
   * @param tasklet tasklet to check
   * @param items multiple words in one string
   * @returns {boolean} true if tasklet matches every search item
   */
  public taskletMatchesEveryItem(tasklet: Tasklet, items: string): boolean {
    const task = this.taskletService.getTaskByTasklet(tasklet);
    const project = this.taskletService.getProjectByTasklet(tasklet);

    return items == null || items.trim() === '' || MatchService.splitSearchItems(items).every(item => {
      return MatchService.taskNameMatchesSingleItem(task, item)
        || MatchService.projectNameMatchesSingleItem(project, item)
        || this.descriptionMatchesSingleItem(tasklet.description, item)
        || this.meetingMinutesMatchesSingleItem(tasklet.meetingMinuteItems, item)
        || this.dailyScrumMatchesSingleItem(tasklet.dailyScrumItems, item)
        || (tasklet.personIds != null && this.personsMatchesSingleItem(tasklet.personIds.map(id => {
          return this.personService.getPersonById(id);
        }).filter(person => {
          return person != null;
        }), item))
        || (tasklet.tagIds != null && this.tagsMatchesSingleItem(tasklet.tagIds.map(id => {
          return this.tagService.getTagById(id);
        }).filter(tag => {
          return tag != null;
        }), item));
    });
  }

  /**
   * Determines whether a task matches every of the specified items
   * @param task task to check
   * @param items multiple words in one string
   * @returns {boolean} true if task matches every search item
   */
  public taskMatchesEveryItem(task: Task, items: string): boolean {
    const project = this.taskService.getProjectByTask(task);
    return items == null || items.trim() === '' || MatchService.splitSearchItems(items).every(item => {
      return MatchService.taskNameMatchesSingleItem(task, item)
        || MatchService.projectNameMatchesSingleItem(project, item)
        || this.descriptionMatchesSingleItem(task.description, item)
        || (task.tagIds != null && this.tagsMatchesSingleItem(task.tagIds.map(id => {
          return this.tagService.getTagById(id);
        }).filter(tag => {
          return tag != null;
        }), item));
    });
  }

  /**
   * Determines whether a project matches every of the specified items
   * @param project project to check
   * @param items multiple words in one string
   * @returns {boolean} true if project matches every search item
   */
  public projectMatchesEveryItem(project: Project, items: string): boolean {
    return items == null || items.trim() === '' || MatchService.splitSearchItems(items).every(item => {
      return MatchService.projectNameMatchesSingleItem(project, item);
    });
  }

  /**
   * Determines whether a tag matches every of the specified items
   * @param tag tag to check
   * @param items multiple words in one string
   * @returns {boolean} true if tag matches every search item
   */
  public tagMatchesEveryItem(tag: Tag, items: string): boolean {
    return items == null || items.trim() === '' || MatchService.splitSearchItems(items).every(item => {
      return MatchService.tagNameMatchesSingleItem(tag, item);
    });
  }

  /**
   * Determines whether a person matches every of the specified items
   * @param person value to check
   * @param items multiple words in one string
   * @returns {boolean}
   */
  public personMatchesEveryItem(person: Person, items: string): boolean {
    return items == null || items.trim() === '' || MatchService.splitSearchItems(items).every(item => {
      return MatchService.personNameMatchesSingleItem(person, item);
    });
  }

  //
  // Search item parts
  //

  /**
   * Determines whether a description matches a given search item
   * @param {Description} description description to check
   * @param {string} item search item
   * @returns {boolean} true if description matches search item
   */
  private descriptionMatchesSingleItem(description: Description, item: string): boolean {
    return description.value != null && description.value.split('\n').some(s => {
      return MatchService.textMatchesSingleItem(s, item);
    });
  }

  /**
   * Determines whether meeting minutes matches a given search item
   * @param {MeetingMinuteItem[]} meetingMinutes meeting minutes to check
   * @param {string} item search item
   * @returns {boolean} true if meeting minutes match search item
   */
  private meetingMinutesMatchesSingleItem(meetingMinutes: MeetingMinuteItem[], item: string): boolean {
    return meetingMinutes != null && meetingMinutes.some(meetingMinute => {
      return MatchService.textMatchesSingleItem(meetingMinute.statement, item);
    });
  }

  /**
   * Determines whether daily scrum matches a given search item
   * @param {DailyScrumItem[]} dailyScrumItems daily scrum items to check
   * @param {string} item search item
   * @returns {boolean} true if daily scrum items match search item
   */
  private dailyScrumMatchesSingleItem(dailyScrumItems: DailyScrumItem[], item: string): boolean {
    return dailyScrumItems != null && dailyScrumItems.some(meetingMinute => {
      return MatchService.textMatchesSingleItem(meetingMinute.statement, item);
    });
  }

  /**
   * Determines whether at least one person of a given array matches a given search item
   * @param {Person[]} persons array of persons to check
   * @param {string} item search item
   * @returns {boolean} true if at least one person matches search item
   */
  private personsMatchesSingleItem(persons: Person[], item: string): boolean {
    return persons != null && persons.some(p => {
      return MatchService.textMatchesSingleItem(p.name, item);
    });
  }

  /**
   * Determines whether at least one tag of a given array matches a given search item
   * @param {Tag[]} tags array of tags to check
   * @param {string} item search item
   * @returns {boolean} true if at least one tag matches search item
   */
  private tagsMatchesSingleItem(tags: Tag[], item: string): boolean {
    return tags != null && tags.some(t => {
      return MatchService.textMatchesSingleItem(t.name, item);
    });
  }
}
