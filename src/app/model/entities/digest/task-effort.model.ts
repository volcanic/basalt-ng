import {Project} from '../project.model';
import {Task} from '../task.model';

/**
 * Represents the effort spent on a specific task
 */
export class TaskEffort {

  /** Task to track effort for */
  task: Task;
  /** Project referenced by the task */
  project: Project;
  /** Effort */
  effort: number;

  /**
   * Constructor
   * @param {Task} task
   * @param {Project} project
   * @param {number} effort
   */
  constructor(task: Task, project: Project, effort: number) {
    this.task = task;
    this.project = project;
    this.effort = effort;
  }
}
