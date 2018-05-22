import {ProjectEffort} from './project-effort.model';
export class DailyDigest {
  weekDayString = '';
  startTime: Date;
  endTime: Date;

  startTimeString = '';
  endTimeString = '';

  projectEfforts = new Map<String, ProjectEffort>();

  getProjectEfforts(): ProjectEffort[] {
    return Array.from(this.projectEfforts.values()).sort((e1, e2) => {
        return e2.effort - e1.effort;
      }
    );
  }
}
