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

  constructor(private taskletsService: TaskletsService,
              private dateService: DateService) {
  }

  public getTaskletsOfDay(date: Date, tasklets: Tasklet[]): Tasklet[] {
    return tasklets.filter(t => {
      return new Date(t.creationDate) > new Date(this.dateService.getDayStart(date))
        && new Date(t.creationDate) < new Date(this.dateService.getDayEnd(date));
    }).sort((t1, t2) => {
      return (new Date(t1.creationDate) > new Date(t2.creationDate)) ? 1 : -1;
    });
  }

  private getTaskletsOfPeriod(startDate: Date, endDate: Date, tasklets: Tasklet[]): Tasklet[] {
    return tasklets.filter(t => {
      return new Date(t.creationDate) > new Date(this.dateService.getWeekStart(startDate))
        && new Date(t.creationDate) < new Date(this.dateService.getWeekEnd(endDate));
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

      dailyDigest.start = tasklets[0].creationDate;
      dailyDigest.end = tasklets[tasklets.length - 1].creationDate;

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
          const minutesNew = this.dateService.getRoundedMinutes((diff / 60000));

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
    const weekStart = this.dateService.getWeekStart(date);

    weeklyDigest.start = this.dateService.getWeekStart(date);
    weeklyDigest.end = this.dateService.getWeekEnd(date);

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
