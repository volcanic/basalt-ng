import {TaskEffort} from './task-effort.model';
import {Project} from '../project.model';

export class ProjectEffort {
  project: Project;
  effort: number;
  taskEfforts: Map<String, TaskEffort>;

  constructor(project: Project, effort: number) {
    this.project = project;
    this.effort = effort;
    this.taskEfforts = new Map<String, TaskEffort>();
  }

  getTaskEfforts(): TaskEffort[] {
    return Array.from(this.taskEfforts.values()).sort((e1, e2) => {
        return e2.effort - e1.effort;
      }
    );
  }
}
