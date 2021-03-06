import {Injectable} from '@angular/core';
import {ProjectDigest} from '../../model/project-digest.model';
import {DateService} from '../../../entity/services/date.service';
import {TaskletType} from '../../../entity/model/tasklet-type.enum';
import {Tasklet} from '../../../entity/model/tasklet.model';
import {TaskletService} from '../../../entity/services/tasklet/tasklet.service';
import {ProjectEffort} from '../../model/project-effort.model';
import {TaskEffort} from '../../model/task-effort.model';
import {Project} from '../../../entity/model/project.model';
import {PlaceholderValues} from '../../../entity/model/placeholder-values.model';
import {Task} from '../../../entity/model/task.model';

/**
 * Handles digests
 */
@Injectable({
  providedIn: 'root'
})
export class DigestService {

  /**
   * Generates a project digest for a given period of time
   * @param tasklets tasklets
   * @param tasksMap tasks map
   * @param projectsMap projects map
   * @param start start date
   * @param end end date
   * @param topic to be displayed as root node
   */
  static getProjectDigest(tasklets: Tasklet[],
                          tasksMap: Map<string, Task>, projectsMap: Map<string, Project>,
                          start: Date, end: Date, topic: string): ProjectDigest {
    const projectDigest = new ProjectDigest();

    if (tasklets.length !== 0) {
      projectDigest.start = tasklets[0].creationDate;
      projectDigest.end = tasklets[tasklets.length - 1].creationDate;
      projectDigest.topic = topic;

      // Iterate over all tasklets
      for (let index = 0; index < tasklets.length; index++) {
        const tasklet = tasklets[index];
        const nextTasklet = tasklets[index + 1];

        if (nextTasklet != null && new Date(tasklet.creationDate).getDay() === new Date(nextTasklet.creationDate).getDay()
          && tasklet.type !== TaskletType.LUNCH_BREAK
          && tasklet.type !== TaskletType.POMODORO_BREAK
          && tasklet.type !== TaskletType.COMMUTE
          && tasklet.type !== TaskletType.FINISHING_TIME) {

          // Additional minutes
          const diff = new Date(nextTasklet.creationDate).getTime() - new Date(tasklet.creationDate).getTime();
          const minutesNew = DateService.getRoundedMinutes((diff / 60000));

          // Get existing efforts (project)
          let project = TaskletService.getProjectByTasklet(tasklet, tasksMap, projectsMap);
          if (project == null) {
            project = new Project(PlaceholderValues.UNSPECIFIED_PROJECT);
            project.id = PlaceholderValues.EMPTY_PROJECT_ID;
          }

          let projectEffort: ProjectEffort = projectDigest.projectEfforts.get(project.id);
          if (projectEffort == null) {
            projectEffort = new ProjectEffort(project, null);
          }

          // Get existing efforts (task)
          let task = TaskletService.getTaskByTasklet(tasklet, tasksMap);
          if (task == null) {
            task = new Task(PlaceholderValues.UNSPECIFIED_TASK);
            task.id = PlaceholderValues.EMPTY_TASK_ID;
          }

          let taskEffort = projectEffort.taskEfforts.get(task.id);
          if (taskEffort == null) {
            taskEffort = new TaskEffort(task, 0);
          }

          // Add new efforts
          taskEffort.effort += minutesNew;
          projectEffort.effort += minutesNew;

          projectEffort.taskEfforts.set(task.id, taskEffort);
          projectDigest.projectEfforts.set(project.id, projectEffort);
        }
      }
    }

    return projectDigest;
  }

  /**
   * Constructor
   * @param taskletService tasklet service
   */
  constructor(private taskletService: TaskletService) {
  }

  /**
   * Generates a digest for given day
   * @param date day to create digest for
   * @param taskletsMap tasklets map
   * @param tasksMap tasks map
   * @param projectsMap projects map
   * @returns digest for the given date
   */
  getDailyDigest(date: Date, taskletsMap: Map<string, Tasklet>, tasksMap: Map<string, Task>, projectsMap: Map<string, Project>): ProjectDigest {
    const start = DateService.getDayStart(date);
    const end = DateService.getDayEnd(date);

    const taskletsOfPeriod = this.getTaskletsOfPeriod(start, end, taskletsMap);
    const firstTasklet = taskletsOfPeriod[0];
    const lastTasklet = taskletsOfPeriod[taskletsOfPeriod.length - 1];

    if (firstTasklet != null && lastTasklet != null) {
      const firstTaskletStart = firstTasklet.creationDate;
      const lastTaskletEnd = taskletsOfPeriod[taskletsOfPeriod.length - 1].creationDate;
      const topic = DateService.getWeekDayString(new Date(start).getDay()) +
        ' [ ' + DateService.getTimeString(firstTaskletStart) + ' - ' + DateService.getTimeString(lastTaskletEnd) + ' ]';

      return DigestService.getProjectDigest(taskletsOfPeriod, tasksMap, projectsMap, start, end, topic);
    } else {
      const topic = DateService.getWeekDayString(new Date(start).getDay());

      return DigestService.getProjectDigest(taskletsOfPeriod, tasksMap, projectsMap, start, end, topic);
    }
  }

  /**
   * Generates a digest for a whole week
   * @param date one day in the week to create the digest for
   * @param taskletsMap tasklets map
   * @param tasksMap tasks map
   * @param projectsMap projects map
   * @returns digest for the week determined by the given date
   */
  getWeeklyDigest(date: Date, taskletsMap: Map<string, Tasklet>, tasksMap: Map<string, Task>, projectsMap: Map<string, Project>): ProjectDigest {
    const start = DateService.getWeekStart(date);
    const end = DateService.getWeekEnd(date);

    const taskletsOfPeriod = this.getTaskletsOfPeriod(start, end, taskletsMap);
    const topic = 'Week ' + DateService.getWeekNumber(new Date(start))
      + ' (' + DateService.getDateRangeString(new Date(start), new Date(end)) + ')';

    return DigestService.getProjectDigest(taskletsOfPeriod, tasksMap, projectsMap, start, end, topic);
  }


  /**
   * Retrieves all tasklets of a given period
   * @param start start date
   * @param end end date
   * @param taskletsMap tasklets map
   * @returns array of tasklets that match the given date
   */
  public getTaskletsOfPeriod(start: Date, end: Date, taskletsMap: Map<string, Tasklet>): Tasklet[] {
    let taskOfPeriod = [];

    if (taskletsMap.size > 0) {

      taskOfPeriod = Array.from(taskletsMap.values()).filter(t => {

        if (new Date(t.creationDate) > new Date(start)
          && new Date(t.creationDate) < new Date(end)) {
        }

        return new Date(t.creationDate) > new Date(start)
          && new Date(t.creationDate) < new Date(end);
      }).sort((t1, t2) => {
        return (new Date(t1.creationDate) > new Date(t2.creationDate)) ? 1 : -1;
      });
    }

    return taskOfPeriod;
  }
}
