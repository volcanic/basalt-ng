import {TaskEffort} from './task-effort.model';
import {Project} from '../project.model';

/**
 * Represents the effort spent on a specific project
 */
export class ProjectEffort {

  /** Project */
  project: Project;
  /** Effort */
  effort: number;
  /** Map of task efforts */
  taskEfforts: Map<String, TaskEffort>;

  /**
   * Constructor
   * @param {Project} project
   * @param {number} effort
   */
  constructor(project: Project, effort: number) {
    this.project = project;
    this.effort = effort;
    this.taskEfforts = new Map<String, TaskEffort>();
  }

  /**
   * Returns a sorted array of task efforts
   * @returns {TaskEffort[]} array of task efforts
   */
  getTaskEfforts(): TaskEffort[] {
    return Array.from(this.taskEfforts.values()).sort((e1, e2) => {
        return e2.effort - e1.effort;
      }
    );
  }
}
