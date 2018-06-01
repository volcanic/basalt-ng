export class TaskEffort {
  task: string;
  project: string;
  effort: number;

  constructor(task: string, project: string, effort: number) {
    this.task = task;
    this.project = project;
    this.effort = effort;
  }
}
