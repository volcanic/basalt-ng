import {Project} from './entities/project.model';
import {Task} from './entities/task.model';

export class TaskEffort {
  task: Task;
  project: Project;
  effort: number;

  constructor(task: Task, project: Project, effort: number) {
    this.task = task;
    this.project = project;
    this.effort = effort;
  }
}
