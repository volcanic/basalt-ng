import {ProjectEffort} from './project-effort.model';
export class DailyDigest {
  start: Date;
  end: Date;

  projectEfforts = new Map<String, ProjectEffort>();

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
        .reduce((teSum, teCurrent) => teSum + teCurrent, 0))
      .reduce((peSum, peCurrent) => peSum + peCurrent, 0);
  }
}
