import {Task} from '../../entity/model/task.model';

/**
 * Represents the effort spent on a specific task
 */
export class TaskEffort {

  /** Task to track effort for */
  task: Task;
  /** Effort */
  effort: number;

  /**
   * Constructor
   * @param {Task} task
   * @param {number} effort
   */
  constructor(task: Task, effort: number) {
    this.task = task;
    this.effort = effort;
  }
}
