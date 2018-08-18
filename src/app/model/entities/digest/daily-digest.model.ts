import {ProjectEffort} from './project-effort.model';

/**
 * Represents a daily digest
 */
export class DailyDigest {

  /** Start of the day */
  start: Date;
  /** End of the day */
  end: Date;
  /** Map of project efforts */
  projectEfforts = new Map<String, ProjectEffort>();

  /**
   * Returns a sorted array of project efforts
   * @returns {ProjectEffort[]} array of project efforts
   */
  getProjectEfforts(): ProjectEffort[] {
    return Array.from(this.projectEfforts.values()).sort((e1, e2) => {
        return e2.effort - e1.effort;
      }
    );
  }

  /**
   * Sums up the efforts of this day's project efforts
   * @returns {number} sum of efforts
   */
  getProjectEffortSum(): number {
    return this.getProjectEfforts()
      .map(pe => pe.getTaskEfforts()
        .map(te => te.effort)
        .reduce((teSum, teCurrent) => teSum + teCurrent, 0))
      .reduce((peSum, peCurrent) => peSum + peCurrent, 0);
  }
}
