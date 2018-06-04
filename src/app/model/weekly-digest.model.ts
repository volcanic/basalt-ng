import {DailyDigest} from './daily-digest.model';
import {ProjectEffort} from './project-effort.model';
import {TaskEffort} from './task-effort.model';

export class WeeklyDigest {
  start = new Date();
  end = new Date();
  dailyDigests: DailyDigest[] = [];

  projectEfforts = new Map<String, ProjectEffort>();
  taskEfforts = new Map<String, TaskEffort>();

  getProjectEfforts(): ProjectEffort[] {
    return Array.from(this.projectEfforts.values()).sort((e1, e2) => {
        return e2.effort - e1.effort;
      }
    );
  }

  getProjectEffortSum(): number {
    return this.getProjectEfforts()
      .map(pe => pe.getTaskEfforts()
        .map(te => te.effort)
        .reduce((teSum, teCurrent) => teSum + teCurrent))
      .reduce((peSum, peCurrent) => peSum + peCurrent);
  }
}
