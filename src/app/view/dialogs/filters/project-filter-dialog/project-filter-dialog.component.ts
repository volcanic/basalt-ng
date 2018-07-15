import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {Project} from '../../../../model/entities/project.model';
import {CloneService} from '../../../../services/util/clone.service';

@Component({
  selector: 'app-project-filter-dialog',
  templateUrl: './project-filter-dialog.component.html',
  styles: [require('./project-filter-dialog.component.scss')],
})
export class ProjectsFilterDialogComponent implements OnInit {
  dialogTitle = '';
  projects: Project[] = [];
  projectsNone = false;

  constructor(private cloneService: CloneService,
              public dialogRef: MatDialogRef<ProjectsFilterDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {

    this.dialogTitle = data.dialogTitle;

    this.projects = this.cloneService.cloneProjects(this.data.projects).sort((p1, p2) => {
      return p1.name > p2.name ? 1 : -1;
    });
    this.projectsNone = this.data.projectsNone;
  }

  ngOnInit() {
  }

  selectAll() {
    this.projects.forEach(p => {
      p.checked = true;
    });
  }

  selectNone() {
    this.projects.forEach(p => {
      p.checked = false;
    });
  }

  apply() {
    this.dialogRef.close({projects: this.projects, projectsNone: this.projectsNone});
  }
}
