import {Injectable} from '@angular/core';
import {TaskletsService} from './tasklets.service';
import {Tasklet} from '../model/tasklet.model';
import {DailyDigest} from '../model/daily-digest.model';
import {DateService} from './date.service';
import {TASKLET_TYPE} from '../model/tasklet-type.enum';
import {ProjectEffort} from '../model/project-effort.model';

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


  getDailyDigest(date: Date): DailyDigest {
    const dailyDigest = new DailyDigest();
    const tasklets = this.getTaskletsOfDay(date, Array.from(this.taskletsService.tasklets.values()));

    dailyDigest.weekDayString = this.dateService.getWeekDayString(date.getDay());

    if (tasklets.length !== 0) {
      dailyDigest.startTime = tasklets[0].creationDate;
      dailyDigest.endTime = tasklets[tasklets.length - 1].creationDate;

      dailyDigest.startTimeString = this.dateService.getTime(dailyDigest.startTime);
      dailyDigest.endTimeString = this.dateService.getTime(dailyDigest.endTime);

      for (let index = 0; index < tasklets.length; index++) {
        const tasklet = tasklets[index];
        const nextTasklet = tasklets[index + 1];

        if (nextTasklet != null && new Date(tasklet.creationDate).getDay() === new Date(nextTasklet.creationDate).getDay()
          && tasklet.type !== TASKLET_TYPE.LUNCH_BREAK
          && tasklet.type !== TASKLET_TYPE.FINISHING_TIME
          && tasklet.type !== TASKLET_TYPE.WEEKLY_DIGEST
          && tasklet.project != null) {

          let projectEffort: ProjectEffort = dailyDigest.projectEfforts.get(tasklet.project.value);

          if (projectEffort == null) {
            projectEffort = new ProjectEffort(tasklet.project, null);
          }

          const minutesAlready = projectEffort != null ? projectEffort.effort : 0;

          const diff = new Date(nextTasklet.creationDate).getTime() - new Date(tasklet.creationDate).getTime();
          const minutesNew = Math.round(diff / 60000);

          projectEffort.effort = minutesAlready + minutesNew;
          dailyDigest.projectEfforts.set(tasklet.project.value, projectEffort);
        }
      }
    }

    return dailyDigest;
  }

  getWeeklyDigest(date: Date) {
    const weeklyDigest: DailyDigest[] = [];

    const weekStart = DigestService.getWeekStart(date);

    [0, 1, 2, 3, 4].forEach(index => {
        const day = new Date(weekStart);

        weeklyDigest.push(this.getDailyDigest(new Date(day.setDate(weekStart.getDate() + index))));
      }
    );

    return weeklyDigest;
  }
}
