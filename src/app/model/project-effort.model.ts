import {Project} from './project.model';

export class ProjectEffort {
  project: Project;
  effort: number;

  constructor(project: Project, effort: number) {
    this.project = project;
    this.effort = effort;
  }
}
