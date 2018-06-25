import {Injectable} from '@angular/core';
import {DailyDigest} from '../model/daily-digest.model';
import {DateService} from './date.service';
import {TASKLET_TYPE} from '../model/tasklet-type.enum';
import {WeeklyDigest} from '../model/weekly-digest.model';
import {Tasklet} from '../model/entities/tasklet.model';
import {TaskletService} from './entities/tasklet.service';
import {ProjectEffort} from '../model/project-effort.model';
import {TaskEffort} from '../model/task-effort.model';
import {EntityService} from './entities/entity.service';
import {Project} from '../model/entities/project.model';
import {PlaceholderValues} from '../model/placeholder-values.model';
import {Task} from '../model/entities/task.model';

@Injectable()
export class DigestService {

  constructor(private entityService: EntityService,
              private taskletService: TaskletService,
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
    const tasklets = this.getTaskletsOfDay(date, Array.from(this.taskletService.tasklets.values())).filter(t => {
      return t.type !== TASKLET_TYPE.WEEKLY_DIGEST;
    });

    if (tasklets.length !== 0) {
      const dailyDigest = new DailyDigest();

      dailyDigest.start = tasklets[0].creationDate;
      dailyDigest.end = tasklets[tasklets.length - 1].creationDate;

      // Iterate over all timeline
      for (let index = 0; index < tasklets.length; index++) {
        const tasklet = tasklets[index];
        const nextTasklet = tasklets[index + 1];

        if (nextTasklet != null && new Date(tasklet.creationDate).getDay() === new Date(nextTasklet.creationDate).getDay()
          && tasklet.type !== TASKLET_TYPE.LUNCH_BREAK
          && tasklet.type !== TASKLET_TYPE.FINISHING_TIME
          && tasklet.type !== TASKLET_TYPE.WEEKLY_DIGEST) {

          // Additional minutes
          const diff = new Date(nextTasklet.creationDate).getTime() - new Date(tasklet.creationDate).getTime();
          const minutesNew = this.dateService.getRoundedMinutes((diff / 60000));

          // Get existing efforts (project)
          let project = this.entityService.getProjectByTasklet(tasklet);
          if (project == null) {
            project = new Project(PlaceholderValues.UNSPECIFIED_PROJECT, false);
            project.id = PlaceholderValues.EMPTY_PROJECT_ID;
          }

          let projectEffort: ProjectEffort = dailyDigest.projectEfforts.get(project.id);
          if (projectEffort == null) {
            projectEffort = new ProjectEffort(project, null);
          }

          // Get existing efforts (task)
          let task = this.entityService.getTaskByTasklet(tasklet);
          if (task == null) {
            task = new Task(PlaceholderValues.UNSPECIFIED_TASK, "");
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
            let projectEffort: ProjectEffort = weeklyDigest.projectEfforts.get(pe.project.name);
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
}
