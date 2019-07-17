import {Injectable} from '@angular/core';
import {Tasklet} from '../model/tasklet.model';
import {Description} from '../model/description.model';
import {Person} from '../model/person.model';
import {ProjectService} from './project/project.service';
import {TaskletService} from './tasklet/tasklet.service';
import {TaskService} from './task/task.service';
import {DateService} from './date.service';
import {TagService} from './tag/tag.service';
import {PersonService} from './person/person.service';
import {MeetingMinuteItem} from '../model/meeting-minutes/meeting-minute-item.model';
import {DailyScrumItem} from '../model/daily-scrum/daily-scrum-item.model';
import {Project} from '../model/project.model';
import {Tag} from '../model/tag.model';
import {Task} from '../model/task.model';

/**
 * Handles matching
 */
@Injectable()
export class MatchService {

  /**
   * Constructor
   * @param projectService project service
   * @param taskService task service
   * @param taskletService tasklet service
   * @param tagService tag service
   * @param personService person service
   */
  constructor(private projectService: ProjectService,
              private taskService: TaskService,
              private taskletService: TaskletService,
              private tagService: TagService,
              private personService: PersonService) {
  }

  /**
   * Normalizes a string in order to make comparison less prone to errors
   * @param value input value
   * @returns normalized string
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
   * @param value1 first value
   * @param value2 second value
   * @returns 1 if the first values comes after the second one, otherwise -1
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
   * @returns true if value includes word
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
   * @param items search items formatted as a single string
   * @returns array of search items
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
   * @param text text to check
   * @param item search item
   * @returns true if text matches search item
   */
  static textMatchesSingleItem(text: string, item: string): boolean {
    return MatchService.valueMatchesSingleItem(text, item);
  }

  /**
   * Determines whether a task matches a single item
   * @param task task to check
   * @param item search item
   * @returns true if task matches search item
   */
  static taskNameMatchesSingleItem(task: Task, item: string): boolean {
    return (task != null) ? MatchService.textMatchesSingleItem(task.name, item) : false;
  }

  /**
   * Determines whether a project matches a single item
   * @param project to check
   * @param item search item
   * @returns true if project matches search item
   */
  static projectNameMatchesSingleItem(project: Project, item: string): boolean {
    return (project != null) ? MatchService.textMatchesSingleItem(project.name, item) : false;
  }

  /**
   * Determines whether a tag's name matches a single item
   * @param tag tag to check
   * @param item search item
   * @returns true if tag's name matches search item
   */
  static tagNameMatchesSingleItem(tag: Tag, item: string): boolean {
    return (tag != null) ? MatchService.textMatchesSingleItem(tag.name, item) : false;
  }

  /**
   * Determines whether a person's name matches a single item
   * @param person person to check
   * @param item search item
   * @returns true if person's name matches search item
   */
  static personNameMatchesSingleItem(person: Person, item: string): boolean {
    return (person != null) ? MatchService.textMatchesSingleItem(person.name, item) : false;
  }

  //
  // Tasklets
  //

  /**
   * Determines if a tasklet matches a given date
   * @param tasklet to check
   * @param date focus date
   * @returns true if the tasklet matches given date
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
   * @param tagsMap tags map
   * @returns true if tasklet matches given tags
   */
  public taskletMatchesTags(tasklet: Tasklet, tagsMap: Map<string, Tag>): boolean {
    return tagsMap.size === 0 || (tasklet != null && tasklet.tagIds != null && tasklet.tagIds.map(id => {
      return tagsMap.get(id);
    }).filter(tag => {
      return tag != null;
    }).some(tag => {
      return this.tagMatchesTags(tag, tagsMap);
    }));
  }

  /**
   * Determines whether a tasklet matches a given set of tags
   * @param task task to check
   * @param tagsMap tags map
   * @returns true if task matches given tags
   */
  public taskMatchesTags(task: Task, tagsMap: Map<string, Tag>): boolean {
    return tagsMap.size === 0 || (task != null && task.tagIds != null && task.tagIds.map(id => {
      return tagsMap.get(id);
    }).filter(tag => {
      return tag != null;
    }).some(tag => {
      return this.tagMatchesTags(tag, tagsMap);
    }));
  }

  /**
   * Determines whether a tag matches a given set of tags
   * @param tag tag to check
   * @param tagsMap tags map
   * @returns true if tag matches given tags
   */
  public tagMatchesTags(tag: Tag, tagsMap: Map<string, Tag>) {
    return (tag == null && tagsMap.size === 0)
      || Array.from(tagsMap.values()).some(t => {
        return tag != null && tag.id != null && t.id === tag.id;
      });
  }

  //
  // Tasks
  //

  /**
   * Determines whether a tasklet matches a given set of tasks
   * @param tasklet tasklet to check
   * @param tasksMap tasks map
   * @returns true if tasklet matches given tasks
   */
  public taskletMatchesTasks(tasklet: Tasklet, tasksMap: Map<string, Task>): boolean {
    const task = TaskletService.getTaskByTasklet(tasklet, tasksMap);

    return tasksMap.size === 0 || this.taskMatchesTasks(task, tasksMap);
  }

  /**
   * Determines whether a task matches a given set of tasks
   * @param task task to check
   * @param tasksMap tasks map
   * @returns true if task matches given tasks
   */
  public taskMatchesTasks(task: Task, tasksMap: Map<string, Task>): boolean {
    return (task == null && tasksMap.size === 0)
      || Array.from(tasksMap.values()).some(t => {
        return task != null && task.id != null && t.id === task.id;
      });
  }

  /**
   * Determines whether a project matches a given set of project
   * @param project project to check
   * @param tasks array of tasks the project should be contained in
   * @returns true if project matches given tasks
   */
  public projectMatchesTasks(project: Project, tasks: Task[]) {
    return tasks.length === 0
      || tasks.some(t => {

        return project != null && project.id != null && t.projectId === project.id;
      });
  }

  //
  // Projects
  //

  /**
   * Determines whether a tasklet matches a given set of projects
   * @param tasklet tasklet to check
   * @param tasksMap tasks map
   * @param projectsMap projects map
   * @returns true if tasklet matches given projects
   */
  public taskletMatchesProjects(tasklet: Tasklet, tasksMap: Map<string, Task>, projectsMap: Map<string, Project>): boolean {
    const project = TaskletService.getProjectByTasklet(tasklet, tasksMap, projectsMap);
    return projectsMap.size === 0 || this.projectMatchesProjects(project, projectsMap);
  }

  /**
   * Determines whether a task matches a given set of projects
   * @param task task to check
   * @param projectsMap projects map
   * @returns true if task matches given projects
   */
  public taskMatchesProjects(task: Task,
                             projectsMap: Map<string, Project>): boolean {
    const project = projectsMap.get(task.projectId);

    return projectsMap.size === 0 || this.projectMatchesProjects(project, projectsMap);
  }

  /**
   * Determines whether a project matches a given set of project
   * @param project project to check
   * @param projectsMap projects map
   * @returns true if project matches given projects
   */
  public projectMatchesProjects(project: Project, projectsMap: Map<string, Project>) {
    return (project == null && projectsMap.size === 0)
      || Array.from(projectsMap.values()).some(p => {
        return project != null && project.id != null && p.id === project.id;
      });
  }

  //
  // Persons
  //

  /**
   * Determines whether a tasklet matches a given set of persons
   * @param tasklet tasklet to check
   * @param personsMap persons map
   * @returns true if tasklet matches given persons
   */
  public taskletMatchesPersons(tasklet: Tasklet, personsMap: Map<string, Person>): boolean {
    return personsMap.size === 0 || (tasklet.personIds != null && tasklet.personIds.map(id => {
      return personsMap.get(id);
    }).filter(person => {
      return person != null;
    }).some(person => {
      return this.personMatchesPersons(person, personsMap);
    }));
  }

  /**
   * Determines whether a task matches a given set of persons
   * @param task task to check
   * @param personsMap persons map
   * @returns true if task matches given persons
   */
  public taskMatchesPersons(task: Task,
                            personsMap: Map<string, Person>): boolean {
    return personsMap.size === 0 || (task.delegatedToId != null
      && this.personMatchesPersons(personsMap.get(task.delegatedToId), personsMap));
  }

  /**
   * Determines whether a task matches a given set of persons
   * @param person person to check
   * @param personsMap persons map
   * @returns true if task matches given persons
   */
  public personMatchesPersons(person: Person, personsMap: Map<string, Person>) {
    return (person == null && personsMap.size === 0)
      || Array.from(personsMap.values()).some(p => {
        return person != null && person.name != null && p.name === person.name;
      });
  }

  //
  // Search item
  //

  /**
   * Determines whether a tasklet matches every of the specified items
   * @param tasklet tasklet to check
   * @param items multiple words in one string
   * @param tasksMap tasks map
   * @param projectsMap projects map
   * @param personsMap persons map
   * @param tagsMap tags map
   * @returns true if tasklet matches every search item
   */
  public taskletMatchesEveryItem(tasklet: Tasklet, items: string,
                                 tasksMap: Map<string, Task>,
                                 projectsMap: Map<string, Project>,
                                 personsMap: Map<string, Person>,
                                 tagsMap: Map<string, Tag>): boolean {
    const task = TaskletService.getTaskByTasklet(tasklet, tasksMap);
    const project = TaskletService.getProjectByTasklet(tasklet, tasksMap, projectsMap);

    return items == null || items.trim() === '' || MatchService.splitSearchItems(items).every(item => {
      return MatchService.taskNameMatchesSingleItem(task, item)
        || MatchService.projectNameMatchesSingleItem(project, item)
        || this.descriptionMatchesSingleItem(tasklet.description, item)
        || this.meetingMinutesMatchesSingleItem(tasklet.meetingMinuteItems, item)
        || this.dailyScrumMatchesSingleItem(tasklet.dailyScrumItems, item)
        || (tasklet.personIds != null && this.personsMatchesSingleItem(tasklet.personIds.map(id => {
          return personsMap.get(id);
        }).filter(person => {
          return person != null;
        }), item))
        || (tasklet.tagIds != null && this.tagsMatchesSingleItem(tasklet.tagIds.map(id => {
          return tagsMap.get(id);
        }).filter(tag => {
          return tag != null;
        }), item));
    });
  }

  /**
   * Determines whether a task matches every of the specified items
   * @param task task to check
   * @param items multiple words in one string
   * @param projectsMap projects map
   * @param tagsMap tags map
   * @returns true if task matches every search item
   */
  public taskMatchesEveryItem(task: Task,
                              items: string,
                              projectsMap: Map<string, Project>,
                              tagsMap: Map<string, Tag>): boolean {
    const project = TaskService.getProjectByTask(task, projectsMap);
    return items == null || items.trim() === '' || MatchService.splitSearchItems(items).every(item => {
      return task != null && (MatchService.taskNameMatchesSingleItem(task, item)
        || MatchService.projectNameMatchesSingleItem(project, item)
        || this.descriptionMatchesSingleItem(task.description, item)
        || (task.tagIds != null && this.tagsMatchesSingleItem(task.tagIds.map(id => {
          return tagsMap.get(id);
        }).filter(tag => {
          return tag != null;
        }), item)));
    });
  }

  /**
   * Determines whether a project matches every of the specified items
   * @param project project to check
   * @param items multiple words in one string
   * @returns true if project matches every search item
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
   * @returns true if tag matches every search item
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
   * @returns true if person matches every item
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
   * @param description description to check
   * @param item search item
   * @returns true if description matches search item
   */
  private descriptionMatchesSingleItem(description: Description, item: string): boolean {
    return description.value != null && description.value.split('\n').some(s => {
      return MatchService.textMatchesSingleItem(s, item);
    });
  }

  /**
   * Determines whether meeting minutes matches a given search item
   * @param meetingMinutes meeting minutes to check
   * @param item search item
   * @returns true if meeting minutes match search item
   */
  private meetingMinutesMatchesSingleItem(meetingMinutes: MeetingMinuteItem[], item: string): boolean {
    return meetingMinutes != null && meetingMinutes.some(meetingMinute => {
      return MatchService.textMatchesSingleItem(meetingMinute.statement, item);
    });
  }

  /**
   * Determines whether daily scrum matches a given search item
   * @param dailyScrumItems daily scrum items to check
   * @param item search item
   * @returns true if daily scrum items match search item
   */
  private dailyScrumMatchesSingleItem(dailyScrumItems: DailyScrumItem[], item: string): boolean {
    return dailyScrumItems != null && dailyScrumItems.some(meetingMinute => {
      return MatchService.textMatchesSingleItem(meetingMinute.statement, item);
    });
  }

  /**
   * Determines whether at least one person of a given array matches a given search item
   * @param persons array of persons to check
   * @param item search item
   * @returns true if at least one person matches search item
   */
  private personsMatchesSingleItem(persons: Person[], item: string): boolean {
    return persons != null && persons.some(p => {
      return MatchService.textMatchesSingleItem(p.name, item);
    });
  }

  /**
   * Determines whether at least one tag of a given array matches a given search item
   * @param tags array of tags to check
   * @param item search item
   * @returns true if at least one tag matches search item
   */
  private tagsMatchesSingleItem(tags: Tag[], item: string): boolean {
    return tags != null && tags.some(t => {
      return MatchService.textMatchesSingleItem(t.name, item);
    });
  }
}
