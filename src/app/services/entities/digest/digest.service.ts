import {Injectable} from '@angular/core';
import {DailyDigest} from '../../../model/entities/digest/daily-digest.model';
import {DateService} from '../../util/date.service';
import {TaskletType} from '../../../model/tasklet-type.enum';
import {WeeklyDigest} from '../../../model/entities/digest/weekly-digest.model';
import {Tasklet} from '../../../model/entities/tasklet.model';
import {TaskletService} from '../tasklet.service';
import {ProjectEffort} from '../../../model/entities/digest/project-effort.model';
import {TaskEffort} from '../../../model/entities/digest/task-effort.model';
import {Project} from '../../../model/entities/project.model';
import {PlaceholderValues} from '../../../model/placeholder-values.model';
import {Task} from '../../../model/entities/task.model';
import {TaskDigest} from '../../../model/entities/digest/task-digest.model';

/**
 * Handles digests
 */
@Injectable({
  providedIn: 'root'
})
export class DigestService {

  /**
   * Constructor
   * @param {TaskletService} taskletService
   */
  constructor(private taskletService: TaskletService) {
  }

  /**
   * Retrieves all tasklets of a given day
   * @param {Date} date date to get tasklets of
   * @param {Tasklet[]} tasklets array of all tasklets
   * @returns {Tasklet[]} array of tasklets that match the given date
   */
  public getTaskletsOfDay(date: Date, tasklets: Tasklet[]): Tasklet[] {
    return tasklets.filter(t => {
      return new Date(t.creationDate) > new Date(DateService.getDayStart(date))
        && new Date(t.creationDate) < new Date(DateService.getDayEnd(date));
    }).sort((t1, t2) => {
      return (new Date(t1.creationDate) > new Date(t2.creationDate)) ? 1 : -1;
    });
  }

  /**
   * Generates a digest for given day
   * @param date day to create digest for
   * @returns {DailyDigest} daily digest for the given date
   */
  getDailyDigest(date: Date): DailyDigest {
    const tasklets = this.getTaskletsOfDay(date, Array.from(this.taskletService.tasklets.values())).filter(t => {
      return t.type !== TaskletType.WEEKLY_DIGEST;
    });

    if (tasklets.length !== 0) {
      const dailyDigest = new DailyDigest();

      dailyDigest.start = tasklets[0].creationDate;
      dailyDigest.end = tasklets[tasklets.length - 1].creationDate;

      // Iterate over all tasklets
      for (let index = 0; index < tasklets.length; index++) {
        const tasklet = tasklets[index];
        const nextTasklet = tasklets[index + 1];

        if (nextTasklet != null && new Date(tasklet.creationDate).getDay() === new Date(nextTasklet.creationDate).getDay()
          && tasklet.type !== TaskletType.LUNCH_BREAK
          && tasklet.type !== TaskletType.FINISHING_TIME
          && tasklet.type !== TaskletType.WEEKLY_DIGEST) {

          // Additional minutes
          const diff = new Date(nextTasklet.creationDate).getTime() - new Date(tasklet.creationDate).getTime();
          const minutesNew = DateService.getRoundedMinutes((diff / 60000));

          // Get existing efforts (project)
          let project = this.taskletService.getProjectByTasklet(tasklet);
          if (project == null) {
            project = new Project(PlaceholderValues.UNSPECIFIED_PROJECT, false);
            project.id = PlaceholderValues.EMPTY_PROJECT_ID;
          }

          let projectEffort: ProjectEffort = dailyDigest.projectEfforts.get(project.id);
          if (projectEffort == null) {
            projectEffort = new ProjectEffort(project, null);
          }

          // Get existing efforts (task)
          let task = this.taskletService.getTaskByTasklet(tasklet);
          if (task == null) {
            task = new Task(PlaceholderValues.UNSPECIFIED_TASK);
            task.id = PlaceholderValues.EMPTY_TASK_ID;
          }

          let taskEffort: TaskEffort = projectEffort.taskEfforts.get(task.id);
          if (taskEffort == null) {
            taskEffort = new TaskEffort(task, project, 0);
          }

          // Add new efforts
          taskEffort.effort += minutesNew;
          projectEffort.effort += minutesNew;

          projectEffort.taskEfforts.set(task.id, taskEffort);
          dailyDigest.projectEfforts.set(project.id, projectEffort);
        }
      }

      return dailyDigest;
    }

    return null;
  }

  /**
   * Generates a digest for a whole week
   * @param date one day in the week to create the digest for
   * @returns {WeeklyDigest} weekly digest for the week determined by the given date
   */
  getWeeklyDigest(date: Date): WeeklyDigest {
    const weeklyDigest: WeeklyDigest = new WeeklyDigest();
    const weekStart = DateService.getWeekStart(date);

    weeklyDigest.start = DateService.getWeekStart(date);
    weeklyDigest.end = DateService.getWeekEnd(date);

    // Iterate over all weekdays
    [0, 1, 2, 3, 4].forEach(index => {
        const day = new Date(weekStart);
        const dailyDigest = this.getDailyDigest(new Date(day.setDate(weekStart.getDate() + index)));

        if (dailyDigest != null) {
          weeklyDigest.dailyDigests.push(dailyDigest);

          // Aggregate project efforts
          dailyDigest.projectEfforts.forEach(pe => {
            // Get existing efforts
            let projectEffort: ProjectEffort = weeklyDigest.projectEfforts.get(pe.project.id);
            if (projectEffort == null) {
              projectEffort = new ProjectEffort(pe.project, null);
            }

            // Aggregate task efforts
            pe.taskEfforts.forEach(te => {
              let taskEffort: TaskEffort = projectEffort.taskEfforts.get(te.task.id);
              if (taskEffort == null) {
                taskEffort = new TaskEffort(te.task, te.project, 0);
              }

              taskEffort.effort += te.effort;
              projectEffort.taskEfforts.set(te.task.id, taskEffort);
            });

            projectEffort.effort += pe.effort;
            weeklyDigest.projectEfforts.set(pe.project.id, projectEffort);
          });
        }
      }
    );

    return weeklyDigest;
  }

  /**
   * Generates a digest for specific task
   * @param task task to create digest for
   * @returns {TaskDigest} digest for the given task
   */
  getTaskDigest(task: Task): TaskDigest {

    const tasklets = Array.from(this.taskletService.tasklets.values()).filter(t => {
      return t.type !== TaskletType.WEEKLY_DIGEST;
    }).sort((t1: Tasklet, t2: Tasklet) => {
      const date1 = new Date(t1.creationDate).getTime();
      const date2 = new Date(t2.creationDate).getTime();

      return date1 - date2;
    });

    if (tasklets.length !== 0) {
      const taskDigest = new TaskDigest();

      taskDigest.start = tasklets[0].creationDate;
      taskDigest.end = tasklets[tasklets.length - 1].creationDate;

      // Iterate over all tasklets
      for (let index = 0; index < tasklets.length; index++) {
        const tasklet = tasklets[index];
        const nextTasklet = tasklets[index + 1];

        if (nextTasklet != null && new Date(tasklet.creationDate).getDay() === new Date(nextTasklet.creationDate).getDay()
          && tasklet.taskId === task.id
          && tasklet.type !== TaskletType.LUNCH_BREAK
          && tasklet.type !== TaskletType.FINISHING_TIME
          && tasklet.type !== TaskletType.WEEKLY_DIGEST) {

          // Additional minutes
          const diff = new Date(nextTasklet.creationDate).getTime() - new Date(tasklet.creationDate).getTime();

          // Add new efforts
          taskDigest.effort += DateService.getRoundedMinutes((diff / 60000));
        }
      }

      return taskDigest;
    }

    return null;
  }
}
