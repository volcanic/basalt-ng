import {Injectable} from '@angular/core';
import {TaskletsService} from './tasklets.service';
import {Tasklet} from '../model/tasklet.model';
import {DailyDigest} from '../model/daily-digest.model';
import {DateService} from './date.service';
import {TASKLET_TYPE} from '../model/tasklet-type.enum';
import {ProjectEffort} from '../model/project-effort.model';
import {WeeklyDigest} from '../model/weekly-digest.model';
import {TaskEffort} from '../model/task-effort.model';

@Injectable()
export class DigestService {

  constructor(private taskletsService: TaskletsService, private dateService: DateService) {
  }

  static getDayStart(date: Date): Date {
    date.setHours(0, 0, 0, 0);

    return new Date(date);
  }

  static getDayEnd(date: Date): Date {
    date.setHours(23, 59, 59, 999);

    return new Date(date);
  }

  /**
   * Returns the beginning of the week that contains a given date {@param date}
   * @returns {Date}
   */
  static getWeekStart(date: Date) {
    date = new Date(date);

    const day = date.getDay();
    const diff: number = date.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(date.setDate(diff));

    return DigestService.getDayStart(monday);
  }

  /**
   * Returns the end of the week that contains a given date {@param date}
   * @returns {Date}
   */
  static getWeekEnd(date: Date) {
    date = new Date(date);

    const day = date.getDay();
    const diff: number = date.getDate() - day + (day === 0 ? 0 : 7);
    const sunday = new Date(date.setDate(diff));


    return DigestService.getDayEnd(sunday);
  }

  private getTaskletsOfDay(date: Date, tasklets: Tasklet[]): Tasklet[] {
    return tasklets.filter(t => {
      return new Date(t.creationDate) > new Date(DigestService.getDayStart(date))
        && new Date(t.creationDate) < new Date(DigestService.getDayEnd(date));
    }).sort((t1, t2) => {
      return (new Date(t1.creationDate) > new Date(t2.creationDate)) ? 1 : -1;
    });
  }

  private getTaskletsOfPeriod(startDate: Date, endDate: Date, tasklets: Tasklet[]): Tasklet[] {
    return tasklets.filter(t => {
      return new Date(t.creationDate) > new Date(DigestService.getWeekStart(startDate))
        && new Date(t.creationDate) < new Date(DigestService.getWeekEnd(endDate));
    }).sort((t1, t2) => {
      return (new Date(t1.creationDate) > new Date(t2.creationDate)) ? 1 : -1;
    });
  }

  /**
   * Generates a digest for certain day
   * @param date day to create digest for
   * @returns {DailyDigest}
   */
  getDailyDigest(date: Date): DailyDigest {
    const tasklets = this.getTaskletsOfDay(date, Array.from(this.taskletsService.tasklets.values())).filter(t => {
      return t.type !== TASKLET_TYPE.WEEKLY_DIGEST;
    });

    if (tasklets.length !== 0) {
      const dailyDigest = new DailyDigest();
      dailyDigest.weekDayString = this.dateService.getWeekDayString(date.getDay());

      dailyDigest.startTime = tasklets[0].creationDate;
      dailyDigest.endTime = tasklets[tasklets.length - 1].creationDate;

      dailyDigest.startTimeString = this.dateService.getTime(dailyDigest.startTime);
      dailyDigest.endTimeString = this.dateService.getTime(dailyDigest.endTime);

      // Iterate over all tasklets
      for (let index = 0; index < tasklets.length; index++) {
        const tasklet = tasklets[index];
        const nextTasklet = tasklets[index + 1];

        if (nextTasklet != null && new Date(tasklet.creationDate).getDay() === new Date(nextTasklet.creationDate).getDay()
          && tasklet.type !== TASKLET_TYPE.LUNCH_BREAK
          && tasklet.type !== TASKLET_TYPE.FINISHING_TIME
          && tasklet.type !== TASKLET_TYPE.WEEKLY_DIGEST
          && tasklet.project != null) {

          // Additional minutes
          const diff = new Date(nextTasklet.creationDate).getTime() - new Date(tasklet.creationDate).getTime();
          const minutesNew = Math.round(diff / 60000);

          // Get existing efforts
          let projectEffort: ProjectEffort = dailyDigest.projectEfforts.get(tasklet.project.value);
          if (projectEffort == null) {
            projectEffort = new ProjectEffort(tasklet.project, null);
          }
          let taskEffort: TaskEffort = projectEffort.taskEfforts.get(tasklet.taskName);
          if (taskEffort == null) {
            taskEffort = new TaskEffort(tasklet.taskName, tasklet.project.value, 0);
          }

          // Add new efforts
          taskEffort.effort += minutesNew;
          projectEffort.effort += minutesNew;

          projectEffort.taskEfforts.set(tasklet.taskName, taskEffort);
          dailyDigest.projectEfforts.set(tasklet.project.value, projectEffort);
        }
      }

      return dailyDigest;
    }

    return null;
  }

  /**
   * Generates a digest for a whole week
   * @param date
   * @returns {WeeklyDigest}
   */
  getWeeklyDigest(date: Date): WeeklyDigest {
    const weeklyDigest: WeeklyDigest = new WeeklyDigest();
    const weekStart = DigestService.getWeekStart(date);

    // Iterate over all weekdays
    [0, 1, 2, 3, 4].forEach(index => {
        const day = new Date(weekStart);
        const dailyDigest = this.getDailyDigest(new Date(day.setDate(weekStart.getDate() + index)));

        if (dailyDigest != null) {
          weeklyDigest.dailyDigests.push(dailyDigest);

          // Aggregate project efforts
          dailyDigest.projectEfforts.forEach(pe => {
            // Get existing efforts
            let projectEffort: ProjectEffort = weeklyDigest.projectEfforts.get(pe.project.value);
            if (projectEffort == null) {
              projectEffort = new ProjectEffort(pe.project, null);
            }

            // Aggregate task efforts
            pe.taskEfforts.forEach(te => {
              let taskEffort: TaskEffort = projectEffort.taskEfforts.get(te.task);
              if (taskEffort == null) {
                taskEffort = new TaskEffort(te.task, te.project, 0);
              }

              taskEffort.effort += te.effort;
              projectEffort.taskEfforts.set(te.task, taskEffort);
            });

            projectEffort.effort += pe.effort;
            weeklyDigest.projectEfforts.set(pe.project.value, projectEffort);
          });
        }
      }
    );

    return weeklyDigest;
  }
}
