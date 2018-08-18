import {DailyDigest} from './daily-digest.model';
import {ProjectEffort} from './project-effort.model';
import {TaskEffort} from './task-effort.model';

/**
 * Represents a weekly digest
 */
export class WeeklyDigest {

  /** Start of the week */
  start = new Date();
  /** End of the week */
  end = new Date();
  /** Array of daily digests */
  dailyDigests: DailyDigest[] = [];

  /** Map of project efforts */
  projectEfforts = new Map<String, ProjectEffort>();
  /** Map of task efforts */
  taskEfforts = new Map<String, TaskEffort>();

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
   * Sums up the efforts of this week's project efforts
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
